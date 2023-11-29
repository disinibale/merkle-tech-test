import { Injectable, Inject } from '@nestjs/common';
import { Request } from 'express';

import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { PresenterModule } from 'src/infrastructure/presenter/presenter.module';
import { FeaturePresenter } from 'src/infrastructure/presenter/presenter';
import { LoginFeature } from 'src/features/auth/login.feature';

import { LoggerService } from '../../logger/logger.service';
import { ExceptionService } from '../../exception/exception.service';
import { EnvironmentConfigService } from '../../config/environment-config/environment-config.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(PresenterModule.LOGIN_FEATURE_PRESENTER)
    private readonly loginFeature: FeaturePresenter<LoginFeature>,
    private readonly envConfig: EnvironmentConfigService,
    private readonly loggerService: LoggerService,
    private readonly exceptionService: ExceptionService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request.cookies?.Authentication;
        },
      ]),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    const user = this.loginFeature
      .getInstance()
      .validateUserJwtStrategy(payload.username);

    if (!user) {
      this.loggerService.warn('JWT', 'User Not Found');
      this.exceptionService.unauthorizedException({
        message: 'User not found!',
      });
    }

    return user;
  }
}
