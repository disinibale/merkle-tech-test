import { Module } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { TransactionsRepository } from './transactions.repository';
import { WalletsRepository } from './wallets.repository';
import { PrismaModule } from '../config/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [UsersRepository, TransactionsRepository, WalletsRepository],
  exports: [UsersRepository, TransactionsRepository, WalletsRepository],
})
export class RepositoriesModule {}
