import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor(private configService: ConfigService) {
    // Try multiple methods to get the DATABASE_URL
    const databaseUrl = configService.get<string>('DATABASE_URL') ||
                         process.env.DATABASE_URL;

    // Log available environment variables for debugging (without values)
    const allEnvKeys = Object.keys(process.env).filter(key =>
      key.includes('DATABASE') || key.includes('JWT') || key.includes('NODE')
    );

    console.log(`[PrismaService] Available environment variables: ${allEnvKeys.join(', ')}`);

    if (!databaseUrl) {
      console.error('[PrismaService] DATABASE_URL not found in ConfigService or process.env');
      console.error(`[PrismaService] Process env keys: ${Object.keys(process.env).join(', ')}`);
      throw new Error(
        'DATABASE_URL environment variable is not set. ' +
        'Available env vars: ' + allEnvKeys.join(', ') + '. ' +
        'Please ensure DATABASE_URL is configured in your deployment environment.'
      );
    }

    console.log('[PrismaService] DATABASE_URL found, initializing Prisma...');

    super({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  cleanDatabase() {
    return this.$transaction([
      this.orderHistory.deleteMany(),
      this.orderItem.deleteMany(),
      this.order.deleteMany(),
      this.customer.deleteMany(),
      this.product.deleteMany(),
      this.user.deleteMany(),
    ]);
  }
}
