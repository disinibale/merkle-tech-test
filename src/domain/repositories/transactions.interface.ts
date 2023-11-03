import { Transactions, Prisma } from '@prisma/client';

export interface TransactionRepositoryDomain {
  transaction(
    transactionsWhereUniqueInput: Prisma.TransactionsWhereUniqueInput,
  ): Promise<Transactions | null>;

  transactions(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.TransactionsWhereUniqueInput;
    where?: Prisma.TransactionsWhereInput;
    orderBy?: Prisma.TransactionsOrderByWithRelationInput;
  }): Promise<Transactions[]>;

  transactionGroup(userId: number): Promise<
    (Prisma.PickEnumerable<
      Prisma.TransactionsGroupByOutputType,
      'senderWalletId'[]
    > & {
      _sum: {
        amount: Prisma.Decimal;
      };
    })[]
  >;

  createTransaction(
    data: Prisma.TransactionsUncheckedCreateInput,
  ): Promise<Transactions>;

  updateTransaction(params: {
    where: Prisma.TransactionsWhereUniqueInput;
    data: Prisma.TransactionsUpdateInput;
  }): Promise<Transactions>;

  deleteTransaction(
    where: Prisma.TransactionsWhereUniqueInput,
  ): Promise<Transactions>;
}
