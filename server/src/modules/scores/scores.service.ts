import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GameMode } from '@prisma/client';
import { ManiaKeys } from '@prisma/client';
import { getDateRange } from '../../common/utils/time-range.util';
import { BeatmapsService } from '../beatmaps/beatmaps.service';

@Injectable()
export class ScoresService {
  constructor(
    private prisma: PrismaService,
    private beatmapsService: BeatmapsService,
  ) {}

  async create(data: {
    id: bigint;

    playerId: number;

    beatmap: {
      id: number;
      beatmapsetId: number;

      artist: string;
      title: string;
      version: string;

      mode: GameMode;

      difficultyRating?: number;
      bpm?: number;
    };

    pp: number;
    accuracy: number;

    gameMode: GameMode;
    maniaKeys?: ManiaKeys;

    combo?: number;
    score?: bigint;

    mods?: number;
    rank?: string;

    createdAt: Date;
  }) {
    await this.beatmapsService.upsertBeatmap(data.beatmap);

    return this.prisma.score.upsert({
      where: {
        id: data.id,
      },

      update: {},

      create: {
        id: data.id,

        playerId: data.playerId,
        beatmapId: data.beatmap.id,

        pp: data.pp,
        accuracy: data.accuracy,

        gameMode: data.gameMode,
        maniaKeys: data.maniaKeys,

        combo: data.combo,
        score: data.score,

        mods: data.mods,
        rank: data.rank,

        createdAt: data.createdAt,
      },
    });
  }

  async findAll() {
    return this.prisma.score.findMany({
      include: { player: true, beatmap: true },
      orderBy: { pp: 'desc' },
    });
  }

  async findLeaderboard(
    mode?: GameMode,
    period?: string,
    page: number = 1,
    limit: number = 50,
  ) {
    const fromDate = getDateRange(period);

    const parsedLimit = Math.min(Number(limit || 50), 100);
    const skip = (page - 1) * parsedLimit;

    const where = {
      ...(mode ? { gameMode: mode } : {}),
      ...(fromDate ? { createdAt: { gte: fromDate } } : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.score.findMany({
        where,
        orderBy: [
          { pp: 'desc' }, // primary ranking
          { accuracy: 'desc' }, // tie-breaker
          { createdAt: 'asc' }, // stable ordering
        ],
        take: parsedLimit,
        skip,
        include: {
          player: true,
          beatmap: true,
        },
      }),

      this.prisma.score.count({ where }),
    ]);

    return {
      items: items.map((item, index) => ({
        ...item,
        rankPosition: skip + index + 1,
      })),
      meta: {
        page,
        limit: parsedLimit,
        total,
        hasNextPage: skip + parsedLimit < total,
      },
    };
  }
}
