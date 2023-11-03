import { Wallets, Prisma } from '@prisma/client';

export interface WalletRepositoryDomain {
  wallet(
    walletsWhereUniqueInput: Prisma.WalletsWhereUniqueInput,
  ): Promise<Wallets | null>;

  walletByUsername(username: string): Promise<Wallets | null>;
  walletByUsernameTransaction(username: string, tx): Promise<Wallets | null>;

  wallets(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.WalletsWhereUniqueInput;
    where?: Prisma.WalletsWhereInput;
    orderBy?: Prisma.WalletsOrderByWithRelationInput;
  }): Promise<Wallets[]>;

  createWallet(data: Prisma.WalletsCreateInput): Promise<Wallets>;

  updateWallet(params: {
    where: Prisma.WalletsWhereUniqueInput;
    data: Prisma.WalletsUpdateInput;
  }): Promise<Wallets>;

  updateWalletTransaction(params: {
    tx: Prisma.TransactionClient;
    where: Prisma.WalletsWhereUniqueInput;
    data: Prisma.WalletsUpdateInput;
  }): Promise<Wallets>;

  updateWalletByUserId(params: {
    userId: number;
    data: Prisma.WalletsUpdateInput;
  }): Promise<Wallets>;

  deleteWallet(where: Prisma.WalletsWhereUniqueInput): Promise<Wallets>;
}
