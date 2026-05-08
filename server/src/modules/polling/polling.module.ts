import { Module } from '@nestjs/common';
import { PollingService } from './polling.service';
import { OsuApiService } from './osu-api.service';
import { PrismaService } from '../../prisma/prisma.service';
import { PlayersModule } from '../players/players.module';
import { ScoresModule } from '../scores/scores.module';

@Module({
  imports: [PlayersModule, ScoresModule],
  providers: [PollingService, OsuApiService, PrismaService],
})
export class PollingModule {}
