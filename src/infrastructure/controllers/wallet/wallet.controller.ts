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

@Controller('wallet')
export class WalletController {
  constructor(
    @Inject(PresenterModule.TOP_UP_BALANCE_PRESENTER)
    private readonly topUpFeature: FeaturePresenter<TopUpBalanceFeature>,
  ) {}

  @Post('topup')
  @UseGuards(JwtAuthGuard)
  async topUp(
    @Body() body: WalletTopUpValidation,
    @User() session: IUserSession,
    @Res() response: Response,
  ) {
    const { amount } = body;
    const { id, username } = session;
    response.status(200).json({ amount, id, username });
  }

  @Get('balance')
  @UseGuards(JwtAuthGuard)
  async getBalance(@User() session: IUserSession, @Res() response: Response) {
    const { username, id } = session;

    response.status(200).json({ username, id });
  }

  @Post('transfer')
  @UseGuards(JwtAuthGuard)
  async transferBalance(
    @Body() body: WalletTransferValidation,
    @User() session: IUserSession,
    @Res() response: Response,
  ) {
    const { username: sender, id: senderId } = session;
    const { amount, to_username: recipient } = body;

    return response.status(200).json({ senderId, sender, amount, recipient });
  }
}
