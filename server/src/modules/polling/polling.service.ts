import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GameMode, Player, Prisma } from '@prisma/client';
import { OsuApiService, OsuScore } from './osu-api.service';

@Injectable()
export class PollingService implements OnModuleInit, OnModuleDestroy {
  private running = true;

  private readonly BATCH_SIZE = 5;

  private readonly beatmapCache = new Set<number>();

  private readonly activePolls = new Set<number>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly osuApi: OsuApiService,
  ) {}

  private MODE_MAP: Record<string, GameMode> = {
    osu: GameMode.OSU,
    taiko: GameMode.TAIKO,
    fruits: GameMode.FRUITS,
    mania: GameMode.MANIA,
  };

  private readonly LEADERBOARD_CONFIG: Record<string, number> = {
    osu: 200,
    mania: 100,
    taiko: 100,
    fruits: 100,
  };

  async onModuleInit() {
    await this.syncLeaderboardPlayers();

    void this.startModeLoop('osu', 10000);
    void this.startModeLoop('taiko', 30000);
    void this.startModeLoop('fruits', 30000);
    void this.startModeLoop('mania', 30000);

    void this.startLeaderboardLoop();
  }

  onModuleDestroy() {
    this.running = false;
  }

  private async startModeLoop(mode: string, interval: number) {
    while (this.running) {
      const started = Date.now();

      try {
        await this.pollMode(mode);
      } catch (err) {
        console.error(`[Polling Loop Error] ${mode}`, err);
      }

      const elapsed = Date.now() - started;

      await this.sleep(Math.max(0, interval - elapsed));
    }
  }

  private async startLeaderboardLoop() {
    while (this.running) {
      try {
        await this.syncLeaderboardPlayers();
      } catch (err) {
        console.error('[Leaderboard Sync Error]', err);
      }

      await this.sleep(1000 * 60 * 30);
    }
  }

  private async pollMode(mode: string) {
    console.log(`[Polling] ${mode}`);

    const batch = await this.getPlayersForMode(mode, this.BATCH_SIZE);

    if (!batch.length) {
      return;
    }

    for (const player of batch) {
      if (this.activePolls.has(player.id)) {
        continue;
      }

      this.activePolls.add(player.id);

      try {
        console.log(`[Polling] player ${player.id} (${player.username})`);

        const scores = await this.osuApi.fetchRecentScoresForUser(
          player.id,
          mode,
        );

        if (!scores.length) {
          await this.prisma.player.update({
            where: {
              id: player.id,
            },

            data: {
              lastPolledAt: new Date(),
            },
          });

          continue;
        }

        const scoreIds = scores.map((s) => BigInt(s.id));

        const existingScores = await this.prisma.score.findMany({
          where: {
            id: {
              in: scoreIds,
            },
          },

          select: {
            id: true,
          },
        });

        const existingSet = new Set(existingScores.map((s) => s.id.toString()));

        let existingCount = 0;

        const ALLOWED_STATUSES = ['ranked', 'approved'];

        for (const score of scores) {
          if (!score.beatmap?.id) {
            continue;
          }

          if (!ALLOWED_STATUSES.includes(score.beatmap.status)) {
            continue;
          }

          if (existingSet.has(String(score.id))) {
            existingCount++;

            if (existingCount >= 3) {
              break;
            }

            continue;
          }

          existingCount = 0;

          await this.ingestScore(player, score, mode);
        }

        const newestScore = scores[0];

        const updateData: Prisma.PlayerUpdateInput = {
          lastPolledAt: new Date(),
        };

        if (newestScore) {
          const newestDate = new Date(newestScore.created_at);

          if (!player.lastScoreAt || newestDate > player.lastScoreAt) {
            updateData.lastScoreAt = newestDate;
          }
        }

        await this.prisma.player.update({
          where: {
            id: player.id,
          },

          data: updateData,
        });
      } catch (err) {
        console.error(`[Polling] failed player ${player.id}`, err);

        await this.prisma.player.update({
          where: {
            id: player.id,
          },

          data: {
            lastPolledAt: new Date(),
          },
        });
      } finally {
        this.activePolls.delete(player.id);
      }

      await this.sleep(200);
    }
  }

  private async ingestScore(player: Player, score: OsuScore, mode: string) {
    if (!score.pp || score.rank === 'F') {
      return;
    }

    const modsInt = this.modsToInt(score.mods);

    const effectiveStats = this.calculateEffectiveStats(
      {
        ar: score.beatmap.ar,
        od: score.beatmap.accuracy,
        cs: score.beatmap.cs,
        hp: score.beatmap.drain,

        bpm: score.beatmap.bpm,

        stars: score.beatmap.difficulty_rating,
      },
      score.mods,
    );

    await this.prisma.player.upsert({
      where: {
        id: player.id,
      },

      update: {
        username: player.username,
        country: player.country,
      },

      create: {
        id: player.id,
        username: player.username,
        country: player.country,
      },
    });

    if (!this.beatmapCache.has(score.beatmap.id)) {
      await this.prisma.beatmap.upsert({
        where: {
          id: score.beatmap.id,
        },

        update: {
          artist: score.beatmapset.artist,
          title: score.beatmapset.title,
          version: score.beatmap.version,

          mode: this.MODE_MAP[mode],

          difficultyRating: score.beatmap.difficulty_rating,

          bpm: score.beatmap.bpm,

          totalLength: score.beatmap.total_length,

          hitLength: score.beatmap.hit_length,

          ar: score.beatmap.ar,
          od: score.beatmap.accuracy,
          cs: score.beatmap.cs,
          hp: score.beatmap.drain,

          maxCombo: score.beatmap.max_combo,

          keyCount: mode === 'mania' ? Math.round(score.beatmap.cs) : null,
        },

        create: {
          id: score.beatmap.id,

          beatmapsetId: score.beatmap.beatmapset_id,

          artist: score.beatmapset.artist,
          title: score.beatmapset.title,
          version: score.beatmap.version,

          mode: this.MODE_MAP[mode],

          difficultyRating: score.beatmap.difficulty_rating,

          bpm: score.beatmap.bpm,

          totalLength: score.beatmap.total_length,

          hitLength: score.beatmap.hit_length,

          ar: score.beatmap.ar,
          od: score.beatmap.accuracy,
          cs: score.beatmap.cs,
          hp: score.beatmap.drain,

          maxCombo: score.beatmap.max_combo,

          keyCount: mode === 'mania' ? Math.round(score.beatmap.cs) : null,
        },
      });

      this.beatmapCache.add(score.beatmap.id);
    }

    const stats = score.statistics ?? {};
    const legacy = score.legacy_statistics ?? {};

    console.log('[RAW STATS]', JSON.stringify(stats, null, 2));

    try {
      await this.prisma.score.create({
        data: {
          id: BigInt(score.id),
          isLazer: score.is_lazer ?? false,

          playerId: player.id,
          beatmapId: score.beatmap.id,

          gameMode: this.MODE_MAP[mode],

          pp: score.pp,

          accuracy: (score.accuracy ?? 0) * 100,

          combo: score.max_combo,

          score: score.score != null ? BigInt(String(score.score)) : null,

          mods: modsInt,

          rank: score.rank,

          count300: stats.count_300 ?? legacy.count_300 ?? 0,

          count100: stats.count_100 ?? legacy.count_100 ?? 0,

          count50: stats.count_50 ?? legacy.count_50 ?? 0,

          countMiss: stats.count_miss ?? legacy.count_miss ?? 0,

          countGeki: stats.count_geki ?? legacy.count_geki ?? null,

          countKatu: stats.count_katu ?? legacy.count_katu ?? null,

          effectiveAr: effectiveStats.ar,
          effectiveOd: effectiveStats.od,
          effectiveCs: effectiveStats.cs,
          effectiveHp: effectiveStats.hp,
          effectiveBpm: effectiveStats.bpm,
          effectiveStarRating: effectiveStats.stars,

          createdAt: new Date(score.created_at),
        },
      });

      console.log(`[Score Inserted] ${player.username} -> ${score.pp}pp`);
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002'
      ) {
        return;
      }

      throw err;
    }
  }

  private async getPlayersForMode(mode: string, take: number) {
    const staleMs = mode === 'osu' ? 1000 * 60 : 1000 * 60 * 3;

    return this.prisma.player.findMany({
      where: {
        country: 'EE',

        modes: {
          has: this.MODE_MAP[mode],
        },

        OR: [
          {
            lastPolledAt: null,
          },

          {
            lastPolledAt: {
              lt: new Date(Date.now() - staleMs),
            },
          },
        ],
      },

      orderBy: {
        lastPolledAt: 'asc',
      },

      take,
    });
  }

  async syncLeaderboardPlayers() {
    for (const [mode, limit] of Object.entries(this.LEADERBOARD_CONFIG)) {
      const pages = limit / 50;

      console.log(`[Sync] fetching EE ${mode} top ${limit}`);

      const users = await this.osuApi.fetchCountryLeaderboard(
        mode,
        'EE',
        pages,
      );

      for (const user of users) {
        const existingPlayer = await this.prisma.player.findUnique({
          where: {
            id: user.id,
          },
        });

        const existingModes = [
          ...new Set([...(existingPlayer?.modes ?? []), this.MODE_MAP[mode]]),
        ];

        await this.prisma.player.upsert({
          where: {
            id: user.id,
          },

          update: {
            username: user.username,

            country: user.country_code,

            globalRank: user.statistics?.global_rank,

            countryRank: user.statistics?.country_rank,

            avatarUrl: user.avatar_url,

            modes: existingModes,
          },

          create: {
            id: user.id,

            username: user.username,

            country: user.country_code,

            globalRank: user.statistics?.global_rank,

            countryRank: user.statistics?.country_rank,

            avatarUrl: user.avatar_url,

            modes: [this.MODE_MAP[mode]],
          },
        });
      }

      console.log(`[Sync] upserted ${users.length} players for ${mode}`);
    }
  }

  private modsToInt(mods: string[]): number {
    const MOD_VALUES: Record<string, number> = {
      NF: 1,
      EZ: 2,
      TD: 4,
      HD: 8,
      HR: 16,
      SD: 32,
      DT: 64,
      RX: 128,
      HT: 256,
      NC: 512,
      FL: 1024,
      AT: 2048,
      SO: 4096,
      AP: 8192,
      PF: 16384,
      FI: 1048576,
      RD: 2097152,
      '4K': 32768,
      '5K': 65536,
      '6K': 131072,
      '7K': 262144,
      '8K': 524288,
      '9K': 16777216,
    };

    return mods.reduce((acc, mod) => {
      return acc | (MOD_VALUES[mod] ?? 0);
    }, 0);
  }

  private calculateEffectiveStats(
    stats: {
      ar?: number;
      od?: number;
      cs?: number;
      hp?: number;
      bpm?: number;
      stars?: number;
    },
    mods: string[],
  ) {
    let ar = stats.ar ?? 0;
    let od = stats.od ?? 0;
    let cs = stats.cs ?? 0;
    let hp = stats.hp ?? 0;

    let bpm = stats.bpm ?? 0;

    let stars = stats.stars ?? 0;

    // HR / EZ
    if (mods.includes('HR')) {
      ar = Math.min(ar * 1.4, 10);
      od = Math.min(od * 1.4, 10);
      cs = Math.min(cs * 1.3, 10);
      hp = Math.min(hp * 1.4, 10);
    }

    if (mods.includes('EZ')) {
      ar *= 0.5;
      od *= 0.5;
      cs *= 0.5;
      hp *= 0.5;
    }

    // clock rate
    let clockRate = 1;

    if (mods.includes('DT') || mods.includes('NC')) {
      clockRate = 1.5;
    }

    if (mods.includes('HT')) {
      clockRate = 0.75;
    }

    // BPM
    bpm *= clockRate;

    // AR timing conversion
    let arMs = ar < 5 ? 1800 - ar * 120 : 1200 - (ar - 5) * 150;

    arMs /= clockRate;

    if (arMs > 1200) {
      ar = (1800 - arMs) / 120;
    } else {
      ar = 5 + (1200 - arMs) / 150;
    }

    // OD timing conversion
    let odMs = 79.5 - od * 6;

    odMs /= clockRate;

    od = (79.5 - odMs) / 6;

    // rough SR scaling
    if (clockRate !== 1) {
      stars *= Math.pow(clockRate, 0.8);
    }

    if (mods.includes('HR')) {
      stars *= 1.06;
    }

    if (mods.includes('EZ')) {
      stars *= 0.92;
    }

    return {
      ar,
      od,
      cs,
      hp,
      bpm,
      stars,
    };
  }

  private sleep(ms: number) {
    return new Promise((res) => setTimeout(res, ms));
  }
}
