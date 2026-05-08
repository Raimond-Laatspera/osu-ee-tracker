import { Module } from '@nestjs/common';
import { BeatmapsService } from './beatmaps.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  providers: [BeatmapsService, PrismaService],
  exports: [BeatmapsService],
})
export class BeatmapsModule {}
