import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { LoggerModule } from './infrastructure/logger/logger.module';
import { ExceptionModule } from './infrastructure/exception/exception.module';
import { BcryptModule } from './infrastructure/services/bcrypt/bcrypt.module';
import { EnvironmentConfigModule } from './infrastructure/config/environment-config/environment-config.module';
import { PresenterModule } from './infrastructure/presenter/presenter.module';
import { LocalStrategy } from './infrastructure/commons/strategies/local.strategy';
import { JwtStrategy } from './infrastructure/commons/strategies/jwt.strategy';
import { JwtServiceModule } from './infrastructure/services/jwt/jwt.module';
import { EnvironmentConfigService } from './infrastructure/config/environment-config/environment-config.service';
import { ControllersModule } from './infrastructure/controllers/controllers.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [EnvironmentConfigModule],
      useFactory: async (configService: EnvironmentConfigService) => ({
        secret: configService.getJwtSecret(),
      }),
      inject: [EnvironmentConfigService],
    }),
    LoggerModule,
    ExceptionModule,
    EnvironmentConfigModule,
    PresenterModule.register(),
    BcryptModule,
    JwtServiceModule,
    EnvironmentConfigModule,
    ControllersModule,
  ],
  providers: [LocalStrategy, JwtStrategy],
})
export class AppModule {}
