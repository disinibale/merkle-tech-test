import { Prisma } from '@prisma/client';
import { ILogger } from 'src/domain/logger/logger.interface';
import { WalletRepositoryDomain } from 'src/domain/repositories/wallets.interface';
import { ExceptionService } from '../../infrastructure/exception/exception.service';
import { PrismaServiceBase } from 'src/domain/config/prisma.base';
import { TransactionRepositoryDomain } from 'src/domain/repositories/transactions.interface';

export class TransferBalanceFeature {
  constructor(
    private readonly logger: ILogger,
    private readonly exceptionService: ExceptionService,
    private readonly walletRepository: WalletRepositoryDomain,
    private readonly transactionRepository: TransactionRepositoryDomain,
    private readonly prisma: PrismaServiceBase,
  ) {}

  async execute(
    senderUsername: string,
    recipientUsername: string,
    amount: number,
  ) {
    return await this.prisma.$transaction(async (tx) => {
      const senderWallet =
        await this.walletRepository.walletByUsernameTransaction(
          senderUsername,
          tx,
        );

      if (!senderWallet) {
        this.exceptionService.notFoundException({
          message: 'Sender not found',
          errorCode: 404,
        });
      }

      const recipientWallet =
        await this.walletRepository.walletByUsernameTransaction(
          recipientUsername,
          tx,
        );

      if (!recipientWallet) {
        this.exceptionService.notFoundException({
          message: 'Recipient Not Found!',
          errorCode: 404,
        });
      }

      const { userId: senderId } = senderWallet;
      const { userId: recipientId } = recipientWallet;

      if (senderId === recipientId) {
        this.exceptionService.badRequestException({
          message:
            'The sender username cannot be the same as the recipient username',
        });
      }

      const sourceWallet = await this.walletRepository.updateWalletTransaction({
        tx,
        where: {
          userId: senderId,
        },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });

      if (sourceWallet.balance < new Prisma.Decimal(0)) {
        this.exceptionService.conflictException({
          message: `Sender balance is insufficient to transfer ${amount}`,
        });
      }

      const targetWallet = await this.walletRepository.updateWalletTransaction({
        tx,
        where: {
          userId: recipientId,
        },
        data: {
          balance: {
            increment: amount,
          },
        },
      });

      const createdTransaction =
        await this.transactionRepository.createTransaction({
          senderWalletId: senderId,
          recipientWalletId: recipientId,
          amount,
        });

      this.logger.debug('Create Transaction', `${createdTransaction}`);

      return {
        amount,
        senderId: targetWallet.userId,
        recipientId: targetWallet.userId,
      };
    });
  }
}
