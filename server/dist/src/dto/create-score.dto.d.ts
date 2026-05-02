import { GameMode, ManiaKeys } from '@prisma/client';
export declare class CreateScoreDto {
    playerId: number;
    pp: number;
    accuracy: number;
    gameMode: GameMode;
    maniaKeys?: ManiaKeys;
    rank: string;
}
