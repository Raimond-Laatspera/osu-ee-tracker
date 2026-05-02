"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScoresService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
const time_range_util_1 = require("./time-range.util");
let ScoresService = class ScoresService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.score.create({
            data,
        });
    }
    async findAll() {
        return this.prisma.score.findMany({
            include: { player: true },
            orderBy: { pp: 'desc' },
        });
    }
    async findLeaderboard(mode, period, page = 1, limit = 50) {
        const fromDate = (0, time_range_util_1.getDateRange)(period);
        const parsedLimit = Math.min(Number(limit || 50), 100);
        const skip = (page - 1) * parsedLimit;
        const where = {
            ...(mode ? { gameMode: mode } : {}),
            ...(fromDate ? { createdAt: { gte: fromDate } } : {}),
        };
        const [items, total] = await Promise.all([
            this.prisma.score.findMany({
                where,
                orderBy: [
                    { pp: 'desc' },
                    { accuracy: 'desc' },
                    { createdAt: 'asc' },
                ],
                take: parsedLimit,
                skip,
                include: {
                    player: true,
                },
            }),
            this.prisma.score.count({ where }),
        ]);
        return {
            items: items.map((item, index) => ({
                ...item,
                rankPosition: skip + index + 1,
            })),
            meta: {
                page,
                limit: parsedLimit,
                total,
                hasNextPage: skip + parsedLimit < total,
            },
        };
    }
};
exports.ScoresService = ScoresService;
exports.ScoresService = ScoresService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ScoresService);
//# sourceMappingURL=scores.service.js.map