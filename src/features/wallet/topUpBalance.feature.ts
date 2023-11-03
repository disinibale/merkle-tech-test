import { ILogger } from 'src/domain/logger/logger.interface';
import { WalletRepositoryDomain } from 'src/domain/repositories/wallets.interface';

export class TopUpBalanceFeature {
  constructor(
    private readonly loggerService: ILogger,
    private readonly walletRepository: WalletRepositoryDomain,
  ) {}

  async execute(userId: number, amount: number) {
    return await this.walletRepository.updateWalletByUserId({
      userId,
      data: {
        balance: {
          increment: amount,
        },
      },
    });
  }
}
