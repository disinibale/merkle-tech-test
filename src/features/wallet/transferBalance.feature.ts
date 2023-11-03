import { Prisma } from '@prisma/client';
import { ILogger } from 'src/domain/logger/logger.interface';
import { WalletRepositoryDomain } from 'src/domain/repositories/wallets.interface';
import { ExceptionService } from '../../infrastructure/exception/exception.service';
import { PrismaServiceBase } from 'src/domain/config/prisma.base';

export class TransferBalanceFeature {
  constructor(
    private readonly logger: ILogger,
    private readonly exceptionService: ExceptionService,
    private readonly walletRepository: WalletRepositoryDomain,
    private readonly prisma: PrismaServiceBase,
  ) {}

  async transferBalance(senderId: number, recipientId: number, amount: number) {
    return await this.prisma.$transaction(async (tx) => {
      const sender = await this.walletRepository.updateWalletTransaction({
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

      if (sender.balance < new Prisma.Decimal(0)) {
        this.exceptionService.conflictException({
          message: `Sender doesn't have enough balance to send ${amount}`,
        });
      }

      const recipient = await this.walletRepository.updateWalletTransaction({
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

      this.logger.log(
        'Wallet',
        `User ${sender.userId} successfully transfer balance of ${amount} to ${recipientId}`,
      );

      return { senderId: sender.userId, recipientId: recipient.userId, amount };
    });
  }
}
