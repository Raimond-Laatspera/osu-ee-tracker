import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ScoresService } from './scores.service';
import { GameMode } from '@prisma/client';
import { ManiaKeys } from '@prisma/client';

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
      playerId: number;
      pp: number;
      accuracy: number;
      gameMode: GameMode;
      maniaKeys?: ManiaKeys;
      rank?: string;
    },
  ) {
    return this.scoresService.create(body);
  }

  @Get('leaderboard')
  getLeaderboard(
    @Query('mode') mode?: GameMode,
    @Query('period') period?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.scoresService.findLeaderboard(
      mode,
      period,
      Number(page || 1),
      Number(limit || 50),
    );
  }
}
