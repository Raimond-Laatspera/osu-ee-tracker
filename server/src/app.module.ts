import { Module } from '@nestjs/common';
import { PlayersModule } from './modules/players/players.module';
import { ScoresModule } from './modules/scores/scores.module';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { PollingModule } from './modules/polling/polling.module';
import { BeatmapsModule } from './modules/beatmaps/beatmaps.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PlayersModule,
    ScoresModule,
    PollingModule,
    BeatmapsModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
