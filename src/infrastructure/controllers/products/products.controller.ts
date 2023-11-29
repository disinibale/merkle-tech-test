import { Response } from 'express';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';

import { FeaturePresenter } from '../../presenter/presenter';
import { PresenterModule } from '../../presenter/presenter.module';

import { CreateProductDTO, UpdateProductDTO } from './products.validations';

import { User } from 'src/domain/decorators/user.decorator';
import { Roles } from 'src/domain/decorators/role.decorator';
import { RoleGuard } from 'src/infrastructure/commons/guards/role.guard';
import { IUserSession } from 'src/infrastructure/commons/types/userRequest';
import { JwtAuthGuard } from 'src/infrastructure/commons/guards/jwtAuth.guard';

import { CreateProductFeature } from 'src/features/products/createProduct.feature';
import { GetProductsFeature } from 'src/features/products/getProducts.feature';
import { UpdateProductFeature } from 'src/features/products/updateProduct.feature';
import { DeleteProductFeature } from 'src/features/products/deleteProduct.feature';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PresenterModule.CREATE_PRODUCT_FEATURE_PRESENTER)
    private readonly createProductFeature: FeaturePresenter<CreateProductFeature>,
    @Inject(PresenterModule.GET_PRODUCTS_FEATURE_PRESENTER)
    private readonly getProductsFeature: FeaturePresenter<GetProductsFeature>,
    @Inject(PresenterModule.UPDATE_PRODUCT_FEATURE_PRESENTER)
    private readonly updateProductFeature: FeaturePresenter<UpdateProductFeature>,
    @Inject(PresenterModule.DELETE_PRODUCT_FEATURE_PRESENTER)
    private readonly deleteProductFeature: FeaturePresenter<DeleteProductFeature>,
  ) {}

  @Post()
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UseGuards(JwtAuthGuard)
  async create(
    @User() session: IUserSession,
    @Body() body: CreateProductDTO,
    @Res() res: Response,
  ) {
    const response = await this.createProductFeature
      .getInstance()
      .execute(body);

    return res.status(201).json(response);
  }

  @Get('/:id')
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UseGuards(JwtAuthGuard)
  async getById(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const response = await this.getProductsFeature.getInstance().getById(id);

    return res.status(200).json(response);
  }

  @Get()
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UseGuards(JwtAuthGuard)
  async getAll(@Res() res: Response) {
    const response = await this.getProductsFeature.getInstance().getAll({});

    return res.status(200).json(response);
  }

  @Put('/:id')
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateProductDTO,
    @Res() res: Response,
  ) {
    const response = await this.updateProductFeature
      .getInstance()
      .execute(id, body);

    return res.status(201).json(response);
  }

  @Delete('/:id')
  @Roles('admin')
  @UseGuards(RoleGuard)
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    await this.deleteProductFeature.getInstance().execute(id);

    return res.status(204).json({ message: 'Successfully remove data' });
  }
}
