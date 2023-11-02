import { Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { LoginFeature } from 'src/features/auth/login.feature';
import { EnvironmentConfigService } from 'src/infrastructure/config/environment-config/environment-config.service';
import { ExceptionService } from 'src/infrastructure/exception/exception.service';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { FeaturePresenter } from 'src/infrastructure/presenter/presenter';
import { PresenterModule } from 'src/infrastructure/presenter/presenter.module';
import { TokenPayload } from 'src/domain/models/auth.model';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    @Inject(PresenterModule.LOGIN_FEATURE_PRESENTER)
    private readonly loginFeature: FeaturePresenter<LoginFeature>,
    private readonly environmentConfig: EnvironmentConfigService,
    private readonly loggerService: LoggerService,
    private readonly exceptionService: ExceptionService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Refresh;
        },
      ]),
      secretOrKey: environmentConfig.getJwtRefreshSecret(),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: TokenPayload) {
    const refreshToken = request?.cookies?.Refresh;
    const user = this.loginFeature
      .getInstance()
      .getUserIfRefreshTokenMatches(refreshToken, payload.username);
    if (!user) {
      this.loggerService.warn('JWT', 'User not found or hash is incorrect!');
      this.exceptionService.unauthorizedException({
        message: 'User not found or hash is incorrect!',
      });
    }

    return user;
  }
}
