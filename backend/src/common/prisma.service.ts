import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
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