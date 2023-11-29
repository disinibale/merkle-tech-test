import { DynamicModule, Module } from '@nestjs/common';

import { IsAuthenticatedFeature } from 'src/features/auth/isAuthenticated.feature';
import { LogoutFeature } from 'src/features/auth/logout.feature';
import { LoginFeature } from 'src/features/auth/login.feature';
import { RegisterFeature } from 'src/features/auth/register.feature';
import { CreateProductFeature } from 'src/features/products/createProduct.feature';
import { GetProductsFeature } from 'src/features/products/getProducts.feature';
import { UpdateProductFeature } from 'src/features/products/updateProduct.feature';
import { DeleteProductFeature } from 'src/features/products/deleteProduct.feature';

import { EnvironmentConfigModule } from '../config/environment-config/environment-config.module';
import { RepositoriesModule } from '../repositories/repositories.module';
import { ExceptionModule } from '../exception/exception.module';
import { BcryptModule } from '../services/bcrypt/bcrypt.module';
import { JwtServiceModule } from '../services/jwt/jwt.module';
import { PrismaModule } from '../config/prisma/prisma.module';
import { LoggerModule } from '../logger/logger.module';

import { EnvironmentConfigService } from '../config/environment-config/environment-config.service';
import { ExceptionService } from '../exception/exception.service';
import { BcryptService } from '../services/bcrypt/bcrypt.service';
import { JwtTokenService } from '../services/jwt/jwt.service';
import { LoggerService } from '../logger/logger.service';

import { UsersRepository } from '../repositories/users.repository';
import { ProductsRepository } from '../repositories/products.repository';
import { FeaturePresenter } from './presenter';
import { OrdersRepository } from '../repositories/orders.repository';
import { GetCartFeature } from 'src/features/carts/getCart.feature';
import { AddItemFeature } from 'src/features/carts/addItem.feature';
import { OrderItemsRepository } from '../repositories/orderItems.repository';
import { PrismaService } from '../config/prisma/prisma.service';
import { RemoveItemFeature } from 'src/features/carts/removeItem.feature';
import { ModifyItemQuantityFeature } from 'src/features/carts/modifyItemQuantity.feature';
import { CheckoutOrderFeature } from 'src/features/checkouts/checkoutOrder.feature';
import { BookResourceFeature } from 'src/features/books/booksResource.feature';
import { BooksRepository } from '../repositories/books.repository';

@Module({
  imports: [
    LoggerModule,
    JwtServiceModule,
    BcryptModule,
    EnvironmentConfigModule,
    RepositoriesModule,
    ExceptionModule,
    PrismaModule,
  ],
})
export class PresenterModule {
  // Login Features
  static LOGIN_FEATURE_PRESENTER = 'LoginFeaturePresenter';
  static IS_AUTHENTICATED_FEATURE_PRESENTER = 'IsAuthenticatedFeaturePresenter';
  static LOGOUT_FEATURE_PRESENTER = 'LogoutFeaturePresenter';
  // Register Features
  static REGISTER_FEATURE_PRESENTER = 'RegisterFeaturePresenter';
  // Product Features
  static CREATE_PRODUCT_FEATURE_PRESENTER = 'CreateProductFeaturePresenter';
  static GET_PRODUCTS_FEATURE_PRESENTER = 'GetProductsFeaturePresenter';
  static UPDATE_PRODUCT_FEATURE_PRESENTER = 'UpdateProductFeaturePresenter';
  static DELETE_PRODUCT_FEATURE_PRESENTER = 'DeleteProductFeaturePresenter';
  // Cart Features
  static GET_CART_FEATURE_PRESENTER = 'GetCartFeaturePresenter';
  static ADD_ITEM_CART_FEATURE_PRESENTER = 'AddItemCartFeaturePresenter';
  static REMOVE_ITEM_CART_FEATURE_PRESENTER = 'RemoveItemCartFeaturePresenter';
  static MODIFY_ITEM_CART_FEATURE_PRESENTER = 'ModifyItemCartFeaturePresenter';
  // Checkout Features
  static CHECKOUT_CART_FEATURE_PRESENTER = 'checkoutCartFeaturePresenter';
  // Books Resources
  static BOOKING_RESOURCES_FEATURE_PRESENTER =
    'BookingResourcesFeaturePresenter';

  static register(): DynamicModule {
    return {
      module: PresenterModule,
      providers: [
        // -- User Authentication Features --
        // 1. Login Feature
        // 2. Is Authenticated Feature
        // 3. Logout Feature
        {
          inject: [
            LoggerService,
            JwtTokenService,
            EnvironmentConfigService,
            UsersRepository,
            BcryptService,
          ],
          provide: PresenterModule.LOGIN_FEATURE_PRESENTER,
          useFactory: (
            logger: LoggerService,
            jwtTokenService: JwtTokenService,
            config: EnvironmentConfigService,
            userRepository: UsersRepository,
            bcryptService: BcryptService,
          ) =>
            new FeaturePresenter(
              new LoginFeature(
                logger,
                jwtTokenService,
                config,
                userRepository,
                bcryptService,
              ),
            ),
        },
        {
          inject: [UsersRepository],
          provide: PresenterModule.IS_AUTHENTICATED_FEATURE_PRESENTER,
          useFactory: (userRepository: UsersRepository) =>
            new FeaturePresenter(new IsAuthenticatedFeature(userRepository)),
        },
        {
          inject: [],
          provide: PresenterModule.LOGOUT_FEATURE_PRESENTER,
          useFactory: () => new FeaturePresenter(new LogoutFeature()),
        },
        // -- Register Feature --
        {
          inject: [
            LoggerService,
            ExceptionService,
            BcryptService,
            UsersRepository,
          ],
          provide: PresenterModule.REGISTER_FEATURE_PRESENTER,
          useFactory: (
            loggerService: LoggerService,
            exceptionService: ExceptionService,
            bcryptService: BcryptService,
            userRepository: UsersRepository,
          ) =>
            new FeaturePresenter(
              new RegisterFeature(
                loggerService,
                exceptionService,
                bcryptService,
                userRepository,
              ),
            ),
        },
        // -- Products Feature --
        {
          inject: [ProductsRepository],
          provide: PresenterModule.CREATE_PRODUCT_FEATURE_PRESENTER,
          useFactory: (productRepository: ProductsRepository) =>
            new FeaturePresenter(new CreateProductFeature(productRepository)),
        },
        {
          inject: [ProductsRepository, ExceptionService],
          provide: PresenterModule.GET_PRODUCTS_FEATURE_PRESENTER,
          useFactory: (
            productRepository: ProductsRepository,
            exceptionService: ExceptionService,
          ) =>
            new FeaturePresenter(
              new GetProductsFeature(productRepository, exceptionService),
            ),
        },
        {
          inject: [ProductsRepository, ExceptionService],
          provide: PresenterModule.UPDATE_PRODUCT_FEATURE_PRESENTER,
          useFactory: (
            productRepository: ProductsRepository,
            exceptionService: ExceptionService,
          ) =>
            new FeaturePresenter(
              new UpdateProductFeature(productRepository, exceptionService),
            ),
        },
        {
          inject: [ProductsRepository, ExceptionService],
          provide: PresenterModule.DELETE_PRODUCT_FEATURE_PRESENTER,
          useFactory: (
            productRepository: ProductsRepository,
            exceptionService: ExceptionService,
          ) =>
            new FeaturePresenter(
              new DeleteProductFeature(productRepository, exceptionService),
            ),
        },
        // Cart Features
        // Get Cart
        {
          inject: [
            ProductsRepository,
            OrdersRepository,
            OrderItemsRepository,
            PrismaService,
            ExceptionService,
          ],
          provide: PresenterModule.ADD_ITEM_CART_FEATURE_PRESENTER,
          useFactory: (
            productRepository: ProductsRepository,
            ordersRepository: OrdersRepository,
            orderItemsRepository: OrderItemsRepository,
            prismaService: PrismaService,
            exceptionService: ExceptionService,
          ) =>
            new FeaturePresenter(
              new AddItemFeature(
                productRepository,
                ordersRepository,
                orderItemsRepository,
                prismaService,
                exceptionService,
              ),
            ),
        },
        {
          inject: [OrdersRepository],
          provide: PresenterModule.GET_CART_FEATURE_PRESENTER,
          useFactory: (ordersRepository: OrdersRepository) =>
            new FeaturePresenter(new GetCartFeature(ordersRepository)),
        },
        // Remove Item From Cart
        {
          inject: [
            OrderItemsRepository,
            OrdersRepository,
            ProductsRepository,
            PrismaService,
            ExceptionService,
          ],
          provide: PresenterModule.REMOVE_ITEM_CART_FEATURE_PRESENTER,
          useFactory: (
            orderItemRepository: OrderItemsRepository,
            ordersRepository: OrdersRepository,
            productRepository: ProductsRepository,
            prismaService: PrismaService,
            exceptionService: ExceptionService,
          ) =>
            new FeaturePresenter(
              new RemoveItemFeature(
                orderItemRepository,
                productRepository,
                ordersRepository,
                prismaService,
                exceptionService,
              ),
            ),
        },
        // Modify Cart
        {
          inject: [
            OrderItemsRepository,
            OrdersRepository,
            ProductsRepository,
            PrismaService,
            ExceptionService,
          ],
          provide: PresenterModule.MODIFY_ITEM_CART_FEATURE_PRESENTER,
          useFactory: (
            orderItemRepository: OrderItemsRepository,
            ordersRepository: OrdersRepository,
            productRepository: ProductsRepository,
            prismaService: PrismaService,
            exceptionService: ExceptionService,
          ) =>
            new FeaturePresenter(
              new ModifyItemQuantityFeature(
                ordersRepository,
                orderItemRepository,
                productRepository,
                prismaService,
                exceptionService,
              ),
            ),
        },
        // Checkout Feature
        {
          inject: [
            OrderItemsRepository,
            OrdersRepository,
            ProductsRepository,
            PrismaService,
            ExceptionService,
          ],
          provide: PresenterModule.CHECKOUT_CART_FEATURE_PRESENTER,
          useFactory: (
            orderItemRepository: OrderItemsRepository,
            ordersRepository: OrdersRepository,
            productsRepository: ProductsRepository,
            prismaService: PrismaService,
            exceptionService: ExceptionService,
          ) =>
            new FeaturePresenter(
              new CheckoutOrderFeature(
                ordersRepository,
                orderItemRepository,
                productsRepository,
                prismaService,
                exceptionService,
              ),
            ),
        },
        {
          inject: [BooksRepository, ExceptionService],
          provide: PresenterModule.BOOKING_RESOURCES_FEATURE_PRESENTER,
          useFactory: (
            booksRepository: BooksRepository,
            exceptionService: ExceptionService,
          ) =>
            new FeaturePresenter(
              new BookResourceFeature(booksRepository, exceptionService),
            ),
        },
      ],
      exports: [
        // Login Features
        PresenterModule.LOGIN_FEATURE_PRESENTER,
        PresenterModule.IS_AUTHENTICATED_FEATURE_PRESENTER,
        PresenterModule.LOGOUT_FEATURE_PRESENTER,
        // Register Features
        PresenterModule.REGISTER_FEATURE_PRESENTER,
        // Product Features
        PresenterModule.CREATE_PRODUCT_FEATURE_PRESENTER,
        PresenterModule.GET_PRODUCTS_FEATURE_PRESENTER,
        PresenterModule.UPDATE_PRODUCT_FEATURE_PRESENTER,
        PresenterModule.DELETE_PRODUCT_FEATURE_PRESENTER,
        // Cart Features
        PresenterModule.GET_CART_FEATURE_PRESENTER,
        PresenterModule.ADD_ITEM_CART_FEATURE_PRESENTER,
        PresenterModule.REMOVE_ITEM_CART_FEATURE_PRESENTER,
        PresenterModule.MODIFY_ITEM_CART_FEATURE_PRESENTER,
        // Checkout Features
        PresenterModule.CHECKOUT_CART_FEATURE_PRESENTER,
        // Books Features
        PresenterModule.BOOKING_RESOURCES_FEATURE_PRESENTER,
      ],
    };
  }
}
