import { Module } from '@nestjs/common';
import { PresenterModule } from '../presenter/presenter.module';
import { AuthController } from './auth/auth.controller';
import { ExceptionModule } from '../exception/exception.module';

@Module({
  imports: [PresenterModule.register(), ExceptionModule],
  controllers: [AuthController],
})
export class ControllersModule {}
