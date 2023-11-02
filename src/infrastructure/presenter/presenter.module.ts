import { DynamicModule, Module } from '@nestjs/common';

import { IsAuthenticatedFeature } from 'src/features/auth/isAuthenticated.feature';
import { LoginFeature } from 'src/features/auth/login.feature';
import { LogoutFeature } from 'src/features/auth/logout.feature';

import { ExceptionModule } from '../exception/exception.module';
import { LoggerModule } from '../logger/logger.module';
import { LoggerService } from '../logger/logger.service';

import { BcryptModule } from '../services/bcrypt/bcrypt.module';
import { BcryptService } from '../services/bcrypt/bcrypt.service';
import { JwtServiceModule } from '../services/jwt/jwt.module';
import { JwtTokenService } from '../services/jwt/jwt.service';

import { UsersRepository } from '../repositories/users.repository';

import { FeaturePresenter } from './presenter';
import { EnvironmentConfigModule } from '../config/environment-config/environment-config.module';
import { EnvironmentConfigService } from '../config/environment-config/environment-config.service';
import { RepositoriesModule } from '../repositories/repositories.module';
import { RegisterFeature } from 'src/features/auth/register.feature';
import { ExceptionService } from '../exception/exception.service';

@Module({
  imports: [
    LoggerModule,
    JwtServiceModule,
    BcryptModule,
    EnvironmentConfigModule,
    RepositoriesModule,
    ExceptionModule,
  ],
})
export class PresenterModule {
  // Login Features
  static LOGIN_FEATURE_PRESENTER = 'LoginFeaturePresenter';
  static IS_AUTHENTICATED_FEATURE_PRESENTER = 'IsAuthenticatedFeaturePresenter';
  static LOGOUT_FEATURE_PRESENTER = 'LogoutFeaturePresenter';

  static REGISTER_FEATURE_PRESENTER = 'RegisterFeaturePresenter';

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
        // -- Register Feature Here --
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
      ],
      exports: [
        // Login Features
        PresenterModule.LOGIN_FEATURE_PRESENTER,
        PresenterModule.IS_AUTHENTICATED_FEATURE_PRESENTER,
        PresenterModule.LOGOUT_FEATURE_PRESENTER,
        // Register Features
        PresenterModule.REGISTER_FEATURE_PRESENTER,
      ],
    };
  }
}
