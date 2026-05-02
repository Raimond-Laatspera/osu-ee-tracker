import { PrismaService } from './prisma.service';
export declare class PlayersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: number;
        username: string;
        country: string;
    }[]>;
    create(data: {
        username: string;
        country: string;
    }): Promise<{
        id: number;
        username: string;
        country: string;
    }>;
}
