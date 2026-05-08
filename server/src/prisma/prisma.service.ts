import {
  INestApplication,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      throw new Error('DATABASE_URL is not defined');
    }

    console.log('🟡 Connecting to PostgreSQL...');

    const adapter = new PrismaPg({
      connectionString: databaseUrl,
    });

    super({
      adapter,

      // useful during ingestion/polling development
      log: [
        {
          emit: 'stdout',
          level: 'warn',
        },

        {
          emit: 'stdout',
          level: 'error',
        },
      ],

      errorFormat: 'pretty',
    });
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.$connect();

      console.log('🟢 Prisma connected');
    } catch (error) {
      console.error('🔴 Prisma connection failed:', error);

      throw error;
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();

    console.log('🟡 Prisma disconnected');
  }

  // graceful shutdown support
  enableShutdownHooks(app: INestApplication): Promise<void> {
    process.on('beforeExit', () => {
      void app.close();
    });

    return Promise.resolve();
  }
}
