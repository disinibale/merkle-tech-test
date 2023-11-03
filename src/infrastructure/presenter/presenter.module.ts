import { DynamicModule, Module } from '@nestjs/common';

import { IsAuthenticatedFeature } from 'src/features/auth/isAuthenticated.feature';
import { LogoutFeature } from 'src/features/auth/logout.feature';
import { LoginFeature } from 'src/features/auth/login.feature';

import { TransferBalanceFeature } from 'src/features/wallet/transferBalance.feature';
import { TopUpBalanceFeature } from 'src/features/wallet/topUpBalance.feature';
import { ReadBalanceFeature } from 'src/features/wallet/readBalance.feature';
import { RegisterFeature } from 'src/features/auth/register.feature';

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

import { WalletsRepository } from '../repositories/wallets.repository';
import { UsersRepository } from '../repositories/users.repository';

import { PrismaService } from '../config/prisma/prisma.service';

import { FeaturePresenter } from './presenter';

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
  // Wallet Features
  static READ_BALANCE_PRESENTER = 'ReadBalancePresenter';
  static TOP_UP_BALANCE_PRESENTER = 'TopUpBalancePresenter';
  static TRANSFER_BALANCE_PRESENTER = 'TransferBalancePresenter';

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
        // -- Wallet Features --
        {
          inject: [LoggerService, WalletsRepository],
          provide: PresenterModule.READ_BALANCE_PRESENTER,
          useFactory: (
            loggerService: LoggerService,
            walletRepository: WalletsRepository,
          ) =>
            new FeaturePresenter(
              new ReadBalanceFeature(loggerService, walletRepository),
            ),
        },
        {
          inject: [LoggerService, WalletsRepository],
          provide: PresenterModule.TOP_UP_BALANCE_PRESENTER,
          useFactory: (
            loggerService: LoggerService,
            walletRepository: WalletsRepository,
          ) =>
            new FeaturePresenter(
              new TopUpBalanceFeature(loggerService, walletRepository),
            ),
        },
        {
          inject: [
            LoggerService,
            ExceptionService,
            WalletsRepository,
            PrismaService,
          ],
          provide: PresenterModule.TRANSFER_BALANCE_PRESENTER,
          useFactory: (
            loggerService: LoggerService,
            exceptionService: ExceptionService,
            walletRepository: WalletsRepository,
            prismaService: PrismaService,
          ) =>
            new FeaturePresenter(
              new TransferBalanceFeature(
                loggerService,
                exceptionService,
                walletRepository,
                prismaService,
              ),
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
        // Wallets Feature
        PresenterModule.READ_BALANCE_PRESENTER,
        PresenterModule.TOP_UP_BALANCE_PRESENTER,
        PresenterModule.TRANSFER_BALANCE_PRESENTER,
      ],
    };
  }
}
