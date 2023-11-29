import { Controller, Inject, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { User } from 'src/domain/decorators/user.decorator';
import { CheckoutOrderFeature } from 'src/features/checkouts/checkoutOrder.feature';
import { JwtAuthGuard } from 'src/infrastructure/commons/guards/jwtAuth.guard';
import { IUserSession } from 'src/infrastructure/commons/types/userRequest';
import { FeaturePresenter } from 'src/infrastructure/presenter/presenter';
import { PresenterModule } from 'src/infrastructure/presenter/presenter.module';

@Controller('checkouts')
export class CheckoutsController {
  constructor(
    @Inject(PresenterModule.CHECKOUT_CART_FEATURE_PRESENTER)
    private readonly checkoutFeature: FeaturePresenter<CheckoutOrderFeature>,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async checkout(@User() session: IUserSession, @Res() res: Response) {
    const response = await this.checkoutFeature
      .getInstance()
      .execute(session.id);

    return res.status(201).json(response);
  }
}
