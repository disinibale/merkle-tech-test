import { Controller, Get, Inject, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { IUserSession, User } from 'src/domain/decorators/user.decorator';
import { GetAggregatedValueFeature } from 'src/features/transaction/getAggregatedValue.feature';
import { GetTopTransactionFeature } from 'src/features/transaction/getTopTransaction.feature';
import { JwtAuthGuard } from 'src/infrastructure/commons/guards/jwtAuth.guard';
import { ExceptionService } from 'src/infrastructure/exception/exception.service';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { FeaturePresenter } from 'src/infrastructure/presenter/presenter';
import { PresenterModule } from 'src/infrastructure/presenter/presenter.module';

@Controller('transaction')
export class TransactionController {
  constructor(
    @Inject(PresenterModule.GET_TOP_TRANSACTION_PRESENTER)
    private readonly getTopTransactionFeature: FeaturePresenter<GetTopTransactionFeature>,
    @Inject(PresenterModule.GET_AGGREGATED_TRANSACTION_PRESENTER)
    private readonly getAggregatedValue: FeaturePresenter<GetAggregatedValueFeature>,
    private readonly loggerService: LoggerService,
    private readonly exceptionService: ExceptionService,
  ) {}

  @Get('top-user')
  @UseGuards(JwtAuthGuard)
  async getTopTransaction(
    @User() session: IUserSession,
    @Res() response: Response,
  ) {
    const { id: userId } = session;

    const result = await this.getTopTransactionFeature
      .getInstance()
      .execute(userId);

    console.log(result);

    return response.status(200).json(result);
  }
}
