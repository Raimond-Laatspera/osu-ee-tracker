import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { GameMode } from '@prisma/client';
import { ManiaKeys } from '@prisma/client';
import { getDateRange } from './time-range.util';

@Injectable()
export class ScoresService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    playerId: number;
    pp: number;
    accuracy: number;
    gameMode: GameMode;
    maniaKeys?: ManiaKeys;
    rank?: string;
  }) {
    return this.prisma.score.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.score.findMany({
      include: { player: true },
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
