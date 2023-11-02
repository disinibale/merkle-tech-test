import {
  Controller,
  Inject,
  Post,
  UseGuards,
  Req,
  Res,
  Body,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { AuthLoginDto } from './auth.validation';

import { PresenterModule } from 'src/infrastructure/presenter/presenter.module';
import { FeaturePresenter } from 'src/infrastructure/presenter/presenter';

import { LoginFeature } from 'src/features/auth/login.feature';
import { IsAuthenticatedFeature } from 'src/features/auth/isAuthenticated.feature';
import { LogoutFeature } from 'src/features/auth/logout.feature';

import { LoginGuard } from 'src/infrastructure/commons/guards/login.guard';
import { RegisterFeature } from 'src/features/auth/register.feature';
import { ExceptionService } from 'src/infrastructure/exception/exception.service';
import { JwtAuthGuard } from 'src/infrastructure/commons/guards/jwtAuth.guard';
import { IsAuthReponse } from './auth.response';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(PresenterModule.LOGIN_FEATURE_PRESENTER)
    private readonly loginFeature: FeaturePresenter<LoginFeature>,
    @Inject(PresenterModule.IS_AUTHENTICATED_FEATURE_PRESENTER)
    private readonly isAuthFeature: FeaturePresenter<IsAuthenticatedFeature>,
    @Inject(PresenterModule.LOGOUT_FEATURE_PRESENTER)
    private readonly logoutFeature: FeaturePresenter<LogoutFeature>,
    @Inject(PresenterModule.REGISTER_FEATURE_PRESENTER)
    private readonly registerFeature: FeaturePresenter<RegisterFeature>,
    private readonly exceptionService: ExceptionService,
  ) {}

  @Post('login')
  @UseGuards(LoginGuard)
  async login(@Body() body: AuthLoginDto, @Res() response: Response) {
    const { username } = body;
    const accessToken = await this.loginFeature
      .getInstance()
      .getCookiesWithToken(username);
    const refreshToken = await this.loginFeature
      .getInstance()
      .getCookiesWithRefreshToken(username);
    const user = await this.loginFeature
      .getInstance()
      .getUserInformation(username);

    await this.loginFeature.getInstance().updateLoginTime(user.id);

    response.setHeader('Set-Cookie', [accessToken, refreshToken]);

    return response.status(200).json(user);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Res() response: Response) {
    const cookie = await this.logoutFeature.getInstance().execute();
    response.setHeader('Set-Cookie', cookie);
    return response.status(200).send({ message: 'User successfully logout' });
  }

  @Post('is-authenticated')
  @UseGuards(JwtAuthGuard)
  async isAuthenticated(@Req() request: any) {
    const user = await this.isAuthFeature
      .getInstance()
      .execute(request.user?.username);
    const response = new IsAuthReponse();
    response.username = user.username;

    return response;
  }

  @Post('register')
  async register(@Body() body: AuthLoginDto, @Res() response: Response) {
    const { username, password } = body;

    const isUserExist = await this.registerFeature
      .getInstance()
      .isUserExist(username);

    if (isUserExist) {
      this.exceptionService.conflictException({
        message: 'This username is taken!',
      });
    }

    const createdUser = await this.registerFeature
      .getInstance()
      .createUserAndWallet(username, password);

    return response.status(201).json(createdUser);
  }
}
