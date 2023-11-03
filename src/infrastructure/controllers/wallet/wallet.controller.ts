import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { TopUpBalanceFeature } from 'src/features/wallet/topUpBalance.feature';
import { FeaturePresenter } from 'src/infrastructure/presenter/presenter';
import { PresenterModule } from 'src/infrastructure/presenter/presenter.module';
import {
  WalletTopUpValidation,
  WalletTransferValidation,
} from './wallet.validations';
import { IUserSession, User } from 'src/domain/decorators/user.decorator';
import { JwtAuthGuard } from 'src/infrastructure/commons/guards/jwtAuth.guard';
import { ReadBalanceFeature } from 'src/features/wallet/readBalance.feature';
import { TransferBalanceFeature } from 'src/features/wallet/transferBalance.feature';
import { ExceptionService } from 'src/infrastructure/exception/exception.service';
import { LoggerService } from 'src/infrastructure/logger/logger.service';

@Controller('wallet')
export class WalletController {
  constructor(
    @Inject(PresenterModule.TOP_UP_BALANCE_PRESENTER)
    private readonly topUpFeature: FeaturePresenter<TopUpBalanceFeature>,
    @Inject(PresenterModule.READ_BALANCE_PRESENTER)
    private readonly readBalanceFeature: FeaturePresenter<ReadBalanceFeature>,
    @Inject(PresenterModule.TRANSFER_BALANCE_PRESENTER)
    private readonly transferBalanceFeature: FeaturePresenter<TransferBalanceFeature>,
    private readonly exceptionService: ExceptionService,
    private readonly loggerService: LoggerService,
  ) {}

  @Post('topup')
  @UseGuards(JwtAuthGuard)
  async topUp(
    @Body() body: WalletTopUpValidation,
    @User() session: IUserSession,
    @Res() response: Response,
  ) {
    const { amount } = body;
    const { id: userId } = session;

    await this.topUpFeature.getInstance().execute(userId, amount);

    response.status(201).json({ message: 'Top up Successful!' });
  }

  @Get('balance')
  @UseGuards(JwtAuthGuard)
  async getBalance(@User() session: IUserSession, @Res() response: Response) {
    const { username } = session;
    const { balance } = await this.readBalanceFeature
      .getInstance()
      .readCurrentBalance(username);

    return response.status(200).json({
      balance: balance,
    });
  }

  @Post('transfer')
  @UseGuards(JwtAuthGuard)
  async transfer(
    @Body() body: WalletTransferValidation,
    @User() session: IUserSession,
    @Res() response: Response,
  ) {
    try {
      const { amount, to_username: recipient } = body;
      const { username: sender } = session;

      const result = await this.transferBalanceFeature
        .getInstance()
        .execute(sender, recipient, amount);

      return response.status(200).json(result);
    } catch (err) {
      this.loggerService.error('Wallet', err);
      throw err;
    }
  }
}
