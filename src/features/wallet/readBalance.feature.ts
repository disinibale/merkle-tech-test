import { Prisma } from 'prisma';
import { ILogger } from 'src/domain/logger/logger.interface';
import { WalletRepositoryDomain } from 'src/domain/repositories/wallets.interface';

export class ReadBalanceFeature {
  constructor(
    private readonly loggerService: ILogger,
    private readonly walletRepository: WalletRepositoryDomain,
  ) {}

  async readCurrentBalance(username: string) {
    return await this.walletRepository.walletByUsername(username);
  }

  async checkIfBallanceSufficient(username: string): Promise<boolean> {
    const wallet = await this.readCurrentBalance(username);
    const zeroBalance: Prisma.Decimal = 0;

    if (wallet.balance > zeroBalance) {
      return true;
    }

    return false;
  }
}
