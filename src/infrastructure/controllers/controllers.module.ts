import { Module } from '@nestjs/common';
import { PresenterModule } from '../presenter/presenter.module';
import { AuthController } from './auth/auth.controller';
import { ExceptionModule } from '../exception/exception.module';
import { WalletController } from './wallet/wallet.controller';
import { LoggerModule } from '../logger/logger.module';
import { TransactionController } from './transaction/transaction.controller';

@Module({
  imports: [PresenterModule.register(), ExceptionModule, LoggerModule],
  controllers: [AuthController, WalletController, TransactionController],
})
export class ControllersModule {}
