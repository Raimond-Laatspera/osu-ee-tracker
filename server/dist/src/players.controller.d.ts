import { PlayersService } from './players.service';
export declare class PlayersController {
    private readonly playersService;
    constructor(playersService: PlayersService);
    findAll(): Promise<{
        id: number;
        username: string;
        country: string;
    }[]>;
    create(body: {
        username: string;
        country: string;
    }): Promise<{
        id: number;
        username: string;
        country: string;
    }>;
}
