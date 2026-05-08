import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GameMode, Player } from '@prisma/client';
import { OsuApiService, OsuScore } from './osu-api.service';

@Injectable()
export class PollingService implements OnModuleInit, OnModuleDestroy {
  private intervals: NodeJS.Timeout[] = [];

  constructor(
    private readonly prisma: PrismaService,
    private readonly osuApi: OsuApiService,
  ) {}

  // osu api mode -> prisma enum
  private MODE_MAP: Record<string, GameMode> = {
    osu: GameMode.OSU,
    taiko: GameMode.TAIKO,
    fruits: GameMode.FRUITS,
    mania: GameMode.MANIA,
  };

  // players processed per polling tick
  private readonly BATCH_SIZE = 5;

  // simple in-memory cursors
  // later you can move these into redis/db
  private playerCursor: Record<string, number> = {
    osu: 0,
    taiko: 0,
    fruits: 0,
    mania: 0,
  };

  onModuleInit() {
    /*    this.intervals.push(
      setInterval(
        () => void this.syncLeaderboardPlayers(),
        24 * 60 * 60 * 1000,
      ),
    );*/ // sync leaderboard players every day
    void this.syncLeaderboardPlayers(); // initial sync on startup
    this.startPolling();
  }

  onModuleDestroy() {
    this.intervals.forEach(clearInterval);
  }

  private startPolling() {
    // standard gets more traffic
    this.intervals.push(setInterval(() => void this.pollMode('osu'), 10000));

    this.intervals.push(setInterval(() => void this.pollMode('taiko'), 30000));

    this.intervals.push(setInterval(() => void this.pollMode('fruits'), 30000));

    this.intervals.push(setInterval(() => void this.pollMode('mania'), 30000));
  }

  // ============================================
  // MAIN MODE POLLING
  // ============================================

  private async pollMode(mode: string) {
    try {
      console.log(`[Polling] ${mode}`);

      const players = await this.getPlayersForMode(mode);

      if (!players.length) {
        console.log(`[Polling] no players for ${mode}`);
        return;
      }

      const batch = this.getNextBatch(mode, players);

      for (const player of batch) {
        try {
          const scores = await this.osuApi.fetchRecentScoresForUser(
            player.id,
            mode,
          );

          const ALLOWED_STATUSES = ['ranked', 'approved'];
          for (const score of scores) {
            // malformed score safety
            if (!score.beatmap?.id) {
              continue;
            }

            if (!ALLOWED_STATUSES.includes(score.beatmap.status)) {
              continue;
            }

            const result = await this.ingestScore(player, score, mode);

            // IMPORTANT:
            // recent scores are newest-first
            // once we hit known score
            // older scores are already known too
            if (result === 'EXISTS') {
              break;
            }
          }

          // update polling timestamp
          await this.prisma.player.update({
            where: {
              id: player.id,
            },

            data: {
              lastPolledAt: new Date(),
            },
          });
        } catch (err) {
          console.error(`[Polling] failed player ${player.id} (${mode})`, err);
        }
      }
    } catch (err) {
      console.error(`[Polling] failed mode ${mode}`, err);
    }
    await new Promise((res) => setTimeout(res, 200)); // small delay between batches to avoid hitting rate limits
  }

  // ============================================
  // SCORE INGESTION
  // ============================================

  private async ingestScore(
    player: Player,
    score: OsuScore,
    mode: string,
  ): Promise<'INSERTED' | 'EXISTS'> {
    // dedupe first
    const existingScore = await this.prisma.score.findUnique({
      where: {
        id: BigInt(score.id),
      },
    });

    if (existingScore) {
      return 'EXISTS';
    }

    // ============================================
    // PLAYER UPSERT
    // ============================================

    await this.prisma.player.upsert({
      where: {
        id: player.id,
      },

      update: {
        username: player.username,
        country: player.country,
        lastScoreAt: new Date(score.created_at),
      },

      create: {
        id: player.id,
        username: player.username,
        country: player.country,
        lastScoreAt: new Date(score.created_at),
      },
    });

    // ============================================
    // BEATMAP UPSERT
    // ============================================

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
      },
    });

    // ============================================
    // RAW SCORE INSERT
    // ============================================

    await this.prisma.score.create({
      data: {
        id: BigInt(score.id),

        playerId: player.id,

        beatmapId: score.beatmap.id,

        pp: score.pp ?? 0,
        accuracy: score.accuracy ?? 0,

        combo: score.max_combo,
        mods: this.modsToInt(score.mods),
        score: BigInt(score.score),

        rank: score.rank,

        gameMode: this.MODE_MAP[mode],

        createdAt: new Date(score.created_at),
      },
    });

    console.log(`[Score Inserted] ${player.username} -> ${score.pp}pp`);

    return 'INSERTED';
  }

  // ============================================
  // PLAYER SELECTION
  // ============================================

  private async getPlayersForMode(mode: string) {
    return this.prisma.player.findMany({
      where: {
        country: 'EE',
        modes: { has: this.MODE_MAP[mode] },
      },

      orderBy: {
        id: 'asc',
      },

      take: mode === 'osu' ? 300 : mode === 'mania' ? 200 : 100,
    });
  }

  // ============================================
  // BATCH CURSOR LOGIC
  // ============================================

  private getNextBatch(mode: string, players: Player[]) {
    const cursor = this.playerCursor[mode] ?? 0;

    const batch = players.slice(cursor, cursor + this.BATCH_SIZE);

    this.playerCursor[mode] =
      cursor + this.BATCH_SIZE >= players.length ? 0 : cursor + this.BATCH_SIZE;

    return batch;
  }

  private readonly LEADERBOARD_CONFIG: Record<string, number> = {
    osu: 200,
    mania: 100,
    taiko: 100,
    fruits: 100,
  };

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
        await this.prisma.player.upsert({
          where: { id: user.id },
          update: {
            username: user.username,
            modes: { push: this.MODE_MAP[mode] }, // adds mode if not present
          },
          create: {
            id: user.id,
            username: user.username,
            country: user.country_code,
            modes: [this.MODE_MAP[mode]],
          },
        });
      }

      console.log(`[Sync] upserted ${users.length} players for ${mode}`);
    }
  }

  // Helper to convert mods to bitmask
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
      '4K': 32768,
      '5K': 65536,
      '6K': 131072,
      '7K': 262144,
      '8K': 524288,
      FI: 1048576,
      RD: 2097152,
      '9K': 16777216,
    };
    return mods.reduce((acc, mod) => acc | (MOD_VALUES[mod] ?? 0), 0);
  }
}
