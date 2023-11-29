import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { User } from 'src/domain/decorators/user.decorator';
import { GetCartFeature } from 'src/features/carts/getCart.feature';
import { JwtAuthGuard } from 'src/infrastructure/commons/guards/jwtAuth.guard';
import { IUserSession } from 'src/infrastructure/commons/types/userRequest';
import { FeaturePresenter } from 'src/infrastructure/presenter/presenter';
import { PresenterModule } from 'src/infrastructure/presenter/presenter.module';
import { AddOrRemoveItemDTO } from './carts.validation';
import { AddItemFeature } from 'src/features/carts/addItem.feature';
import { RemoveItemFeature } from 'src/features/carts/removeItem.feature';
import { ModifyItemQuantityFeature } from 'src/features/carts/modifyItemQuantity.feature';

@Controller('carts')
export class CartsController {
  constructor(
    @Inject(PresenterModule.GET_CART_FEATURE_PRESENTER)
    private readonly getCartFeature: FeaturePresenter<GetCartFeature>,
    @Inject(PresenterModule.ADD_ITEM_CART_FEATURE_PRESENTER)
    private readonly addCartItemFeature: FeaturePresenter<AddItemFeature>,
    @Inject(PresenterModule.REMOVE_ITEM_CART_FEATURE_PRESENTER)
    private readonly removeCartItemFeature: FeaturePresenter<RemoveItemFeature>,
    @Inject(PresenterModule.MODIFY_ITEM_CART_FEATURE_PRESENTER)
    private readonly modifyCartItem: FeaturePresenter<ModifyItemQuantityFeature>,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getCart(@User() session: IUserSession, @Res() res: Response) {
    const { id: userId } = session;

    const response = await this.getCartFeature
      .getInstance()
      .getOrCreateCart(userId);

    res.status(200).json(response);
  }

  @Post('/add/:productId')
  @UseGuards(JwtAuthGuard)
  async addItem(
    @User() session: IUserSession,
    @Param('productId', ParseIntPipe) productId: number,
    @Body() body: AddOrRemoveItemDTO,
    @Res() res: Response,
  ) {
    const { id: userId } = session;
    const { quantity } = body;

    const response = await this.addCartItemFeature
      .getInstance()
      .execute(userId, productId, quantity);

    return res.status(201).json(response);
  }

  @Post('/remove/:productId')
  @UseGuards(JwtAuthGuard)
  async removeItem(
    @User() session: IUserSession,
    @Param('productId', ParseIntPipe) productId: number,
    @Res() res: Response,
  ) {
    const { id: userId } = session;

    const response = await this.removeCartItemFeature
      .getInstance()
      .removeItem(userId, productId);

    return res.status(204).json(response);
  }

  @Post('/modify/:productId')
  @UseGuards(JwtAuthGuard)
  async modifyItem(
    @User() session: IUserSession,
    @Body() body: AddOrRemoveItemDTO,
    @Param('productId', ParseIntPipe) productId: number,
    @Res() res: Response,
  ) {
    const { id: userId } = session;
    const { quantity } = body;

    const response = await this.modifyCartItem
      .getInstance()
      .execute(userId, productId, quantity);

    return res.status(201).json(response);
  }
}
