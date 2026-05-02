import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class PlayersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.player.findMany();
  }

  async create(data: { username: string; country: string }) {
    return this.prisma.player.create({
      data: {
        ...data,
        id: Math.floor(Math.random() * 1000000),
      },
    });
  }
}