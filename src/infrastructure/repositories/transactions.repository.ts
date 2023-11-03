import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { TransactionRepositoryDomain } from 'src/domain/repositories/transactions.interface';
import { PrismaService } from '../config/prisma/prisma.service';

@Injectable()
export class TransactionsRepository implements TransactionRepositoryDomain {
  constructor(private readonly prismaService: PrismaService) {}

  async transaction(
    transactionsWhereUniqueInput: Prisma.TransactionsWhereUniqueInput,
  ): Promise<{
    id: number;
    senderWalletId: number;
    recipientWalletId: number;
    amount: Decimal;
    createdAt: Date;
    updatedAt: Date;
  }> {
    return this.prismaService.transactions.findUnique({
      where: transactionsWhereUniqueInput,
    });
  }

  async transactions(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.TransactionsWhereUniqueInput;
    where?: Prisma.TransactionsWhereInput;
    orderBy?: Prisma.TransactionsOrderByWithRelationInput;
  }): Promise<
    {
      id: number;
      senderWalletId: number;
      recipientWalletId: number;
      amount: Prisma.Decimal;
      createdAt: Date;
      updatedAt: Date;
    }[]
  > {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prismaService.transactions.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async transactionGroup(userId: number) {
    return this.prismaService.transactions.groupBy({
      by: ['senderWalletId'],
      _sum: {
        amount: true,
      },
      where: {
        senderWalletId: {
          not: userId,
        },
      },
      orderBy: {
        _sum: {
          amount: 'desc',
        },
      },
      take: 10,
    });
  }

  async createTransaction(
    data: Prisma.TransactionsUncheckedCreateInput,
  ): Promise<{
    id: number;
    senderWalletId: number;
    recipientWalletId: number;
    amount: Prisma.Decimal;
    createdAt: Date;
    updatedAt: Date;
  }> {
    return this.prismaService.transactions.create({ data });
  }

  async updateTransaction(params: {
    where: Prisma.TransactionsWhereUniqueInput;
    data: Prisma.TransactionsUpdateInput;
  }): Promise<{
    id: number;
    senderWalletId: number;
    recipientWalletId: number;
    amount: Prisma.Decimal;
    createdAt: Date;
    updatedAt: Date;
  }> {
    const { where, data } = params;
    return this.prismaService.transactions.update({ where, data });
  }

  async deleteTransaction(where: Prisma.TransactionsWhereUniqueInput): Promise<{
    id: number;
    senderWalletId: number;
    recipientWalletId: number;
    amount: Prisma.Decimal;
    createdAt: Date;
    updatedAt: Date;
  }> {
    return this.prismaService.transactions.delete({ where });
  }
}
