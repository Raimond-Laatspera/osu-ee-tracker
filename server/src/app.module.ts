import { Module } from '@nestjs/common';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';
import { ScoresController } from './scores.controller';
import { ScoresService } from './scores.service';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [PlayersController, ScoresController],
  providers: [PlayersService, ScoresService, PrismaService],
})
export class AppModule {}
