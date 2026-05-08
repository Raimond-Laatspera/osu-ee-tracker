import { IsEnum, IsOptional } from 'class-validator';
import { GameMode } from '@prisma/client';

export class LeaderboardQueryDto {
  @IsOptional()
  @IsEnum(GameMode)
  mode?: GameMode;

  @IsOptional()
  period?: string;
}
