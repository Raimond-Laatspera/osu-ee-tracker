import { ScoresService } from './scores.service';
import { GameMode } from '@prisma/client';
import { ManiaKeys } from '@prisma/client';
export declare class ScoresController {
    private readonly scoresService;
    constructor(scoresService: ScoresService);
    findAll(): Promise<({
        player: {
            id: number;
            username: string;
            country: string;
        };
    } & {
        id: number;
        pp: number;
        accuracy: number;
        rank: string | null;
        gameMode: import("@prisma/client").$Enums.GameMode;
        maniaKeys: import("@prisma/client").$Enums.ManiaKeys | null;
        createdAt: Date;
        playerId: number;
    })[]>;
    create(body: {
        playerId: number;
        pp: number;
        accuracy: number;
        gameMode: GameMode;
        maniaKeys?: ManiaKeys;
        rank?: string;
    }): Promise<{
        id: number;
        pp: number;
        accuracy: number;
        rank: string | null;
        gameMode: import("@prisma/client").$Enums.GameMode;
        maniaKeys: import("@prisma/client").$Enums.ManiaKeys | null;
        createdAt: Date;
        playerId: number;
    }>;
    getLeaderboard(mode?: GameMode, period?: string, page?: string, limit?: string): Promise<{
        items: {
            rankPosition: number;
            player: {
                id: number;
                username: string;
                country: string;
            };
            id: number;
            pp: number;
            accuracy: number;
            rank: string | null;
            gameMode: import("@prisma/client").$Enums.GameMode;
            maniaKeys: import("@prisma/client").$Enums.ManiaKeys | null;
            createdAt: Date;
            playerId: number;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            hasNextPage: boolean;
        };
    }>;
}
