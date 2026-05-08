import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { GameMode } from '@prisma/client';

@Injectable()
export class BeatmapsService {
  constructor(private prisma: PrismaService) {}

  async upsertBeatmap(data: {
    id: number;
    beatmapsetId: number;

    artist: string;
    title: string;
    version: string;

    mode: GameMode;

    difficultyRating?: number;
    bpm?: number;

    totalLength?: number;
    hitLength?: number;
  }) {
    return this.prisma.beatmap.upsert({
      where: {
        id: data.id,
      },

      update: {
        artist: data.artist,
        title: data.title,
        version: data.version,
        mode: data.mode,
        difficultyRating: data.difficultyRating,
        bpm: data.bpm,
        totalLength: data.totalLength,
        hitLength: data.hitLength,
      },

      create: {
        ...data,
      },
    });
  }

  async findById(id: number) {
    return this.prisma.beatmap.findUnique({
      where: { id },
    });
  }
}
