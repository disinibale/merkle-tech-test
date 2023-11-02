import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { PresenterModule } from 'src/infrastructure/presenter/presenter.module';
import { FeaturePresenter } from 'src/infrastructure/presenter/presenter';
import { LoginFeature } from 'src/features/auth/login.feature';

import { ExceptionService } from 'src/infrastructure/exception/exception.service';
import { LoggerService } from 'src/infrastructure/logger/logger.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(PresenterModule.LOGIN_FEATURE_PRESENTER)
    private readonly loginFeature: FeaturePresenter<LoginFeature>,
    private readonly loggerService: LoggerService,
    private readonly exceptionService: ExceptionService,
  ) {
    super();
  }

  async validate(username: string, password: string) {
    if (!username || !password) {
      this.loggerService.warn(
        'LocalStrategy',
        `Username or password is missing, BadRequestException`,
      );
      this.exceptionService.badRequestException({
        message: 'Username or Password is missing!',
      });
    }
    const user = await this.loginFeature
      .getInstance()
      .validateUserLocalStrategy(username, password);
    if (!user) {
      this.loggerService.warn('LocalStrategy', `Invalid username or password`);
      this.exceptionService.badRequestException({
        message: 'Invalid username or password.',
      });
    }
    return user;
  }
}
