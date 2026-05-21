import { IsEnum, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

import { Type } from 'class-transformer';

import { GameMode } from '@prisma/client';

export class CreateScoreDto {
  @IsInt()
  @Type(() => Number)
  playerId!: number;

  @IsNumber()
  @Type(() => Number)
  pp!: number;

  @IsNumber()
  @Type(() => Number)
  accuracy!: number;

  @IsEnum(GameMode)
  gameMode!: GameMode;

  @IsOptional()
  @IsString()
  rank?: string;
}
