import { Module } from '@nestjs/common';
import { PresenterModule } from '../presenter/presenter.module';
import { AuthController } from './auth/auth.controller';
import { ExceptionModule } from '../exception/exception.module';
import { LoggerModule } from '../logger/logger.module';
import { JwtServiceModule } from '../services/jwt/jwt.module';
import { ProductsController } from './products/products.controller';
import { CartsController } from './carts/carts.controller';
import { CheckoutsController } from './checkouts/checkouts.controller';
import { WeddingBooksController } from './wedding-books/wedding-books.controller';

@Module({
  imports: [
    PresenterModule.register(),
    ExceptionModule,
    LoggerModule,
    JwtServiceModule,
  ],
  controllers: [
    AuthController,
    ProductsController,
    CartsController,
    CheckoutsController,
    WeddingBooksController,
  ],
})
export class ControllersModule {}
