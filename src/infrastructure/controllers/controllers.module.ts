import { Module } from '@nestjs/common';
import { PresenterModule } from '../presenter/presenter.module';
import { AuthController } from './auth/auth.controller';
import { ExceptionModule } from '../exception/exception.module';
import { WalletController } from './wallet/wallet.controller';

@Module({
  imports: [PresenterModule.register(), ExceptionModule],
  controllers: [AuthController, WalletController],
})
export class ControllersModule {}
