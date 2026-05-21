import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ScoresService } from '../../modules/scores/scores.service';
import { GameMode } from '@prisma/client';

@Controller('scores')
export class ScoresController {
  constructor(private readonly scoresService: ScoresService) {}

  @Get()
  findAll() {
    return this.scoresService.findAll();
  }

  @Post()
  create(
    @Body()
    body: {
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

        ar?: number;
        od?: number;
        hp?: number;
        cs?: number;

        keyCount?: number;
      };

      pp: number;
      accuracy: number;

      gameMode: GameMode;

      combo?: number;
      score?: bigint;

      mods?: number;
      rank?: string;

      createdAt: Date;
    },
  ) {
    return this.scoresService.create(body);
  }

  MODE_MAP: Record<string, GameMode> = {
    OSU: GameMode.OSU,
    TAIKO: GameMode.TAIKO,
    FRUITS: GameMode.FRUITS,
    MANIA: GameMode.MANIA,

    STANDARD: GameMode.OSU,
    CATCH: GameMode.FRUITS,
  };

  @Get('leaderboard')
  getLeaderboard(
    @Query('mode') mode?: GameMode,
    @Query('period') period?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const resolvedMode = mode ? this.MODE_MAP[mode.toUpperCase()] : undefined;

    return this.scoresService.findLeaderboard(
      resolvedMode,
      period,
      Number(page || 1),
      Number(limit || 50),
    );
  }
}
