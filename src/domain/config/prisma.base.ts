import { OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaClientOptions } from '@prisma/client/runtime/library';

export class PrismaServiceBase extends PrismaClient implements OnModuleInit {
  constructor(options?: PrismaClientOptions) {
    super(options);
  }

  async onModuleInit() {
    await this.$connect();
  }
}
