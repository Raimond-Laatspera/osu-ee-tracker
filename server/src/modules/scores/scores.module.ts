import { Module } from '@nestjs/common';
import { ScoresController } from './scores.controller';
import { ScoresService } from './scores.service';
import { PrismaService } from '../../prisma/prisma.service';
import { BeatmapsModule } from '../beatmaps/beatmaps.module';

@Module({
  imports: [BeatmapsModule],
  controllers: [ScoresController],
  providers: [ScoresService, PrismaService],
  exports: [ScoresService], // important for future modules (scores, polling, etc.)
})
export class ScoresModule {}
