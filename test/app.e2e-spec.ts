import { Test } from '@nestjs/testing';
import { INestApplication, ExecutionContext } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { LoginFeature } from 'src/features/auth/login.feature';
import { IsAuthenticatedFeature } from '../src/features/auth/isAuthenticated.feature';
import { FeaturePresenter } from 'src/infrastructure/presenter/presenter';
import { PresenterModule } from 'src/infrastructure/presenter/presenter.module';
import { JwtAuthGuard } from 'src/infrastructure/commons/guards/jwtAuth.guard';
import cookieParser from 'cookie-parser';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let loginFeature: LoginFeature;
  let isAuthenticatedFeature: IsAuthenticatedFeature;

  beforeEach(async () => {
    loginFeature = {} as LoginFeature;
    loginFeature.getCookiesWithToken = jest.fn();
    loginFeature.validateUserLocalStrategy = jest.fn();
    loginFeature.getCookiesWithRefreshToken = jest.fn();
    const loginFeatureService: FeaturePresenter<LoginFeature> = {
      getInstance: () => loginFeature,
    } as FeaturePresenter<LoginFeature>;

    isAuthenticatedFeature = {} as IsAuthenticatedFeature;
    isAuthenticatedFeature.execute = jest.fn();
    const isAuthenticatedFeatureService: FeaturePresenter<IsAuthenticatedFeature> =
      {
        getInstance: () => isAuthenticatedFeature,
      } as FeaturePresenter<IsAuthenticatedFeature>;

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PresenterModule.IS_AUTHENTICATED_FEATURE_PRESENTER)
      .useValue(isAuthenticatedFeatureService)
      .overrideProvider(PresenterModule.LOGIN_FEATURE_PRESENTER)
      .useValue(loginFeatureService)
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate(context: ExecutionContext) {
          const req = context.switchToHttp().getRequest();
          req.user = { username: 'username' };
          return (
            JSON.stringify(req.cookies) ===
            JSON.stringify({
              Authentication: '123456',
              Path: '/',
              'Max-Age': '1800',
            })
          );
        },
      })
      .compile();

    app = moduleRef.createNestApplication();
    app.use(cookieParser());
    await app.init();
  });

  it('/(POST) Login should return 201', async (done) => {
    const createdAt = new Date().toISOString();
    const updatedAt = new Date().toISOString();
    (loginFeature.validateUserLocalStrategy as jest.Mock).mockReturnValue(
      Promise.resolve({
        id: 1,
        username: 'username',
        createdAt,
        updatedAt,
        lastLogin: null,
        hashRefreshToken: null,
      }),
    );
    (loginFeature.getCookiesWithToken as jest.Mock).mockReturnValue(
      Promise.resolve(
        `Authentication=123456; HttpOnly; Path=/; Max-Age=${process.env.JWT_EXPIRATION}`,
      ),
    );
    (loginFeature.getUserIfRefreshTokenMatches as jest.Mock).mockReturnValue(
      Promise.resolve(
        `Authentication=123456; HttpOnly; Path=/; Max-Age=${process.env.JWT_REFRESH_EXPIRATION}`,
      ),
    );

    const result = await request(app.getHttpServer())
      .post('/api/v1/')
      .send({ username: 'username', password: 'password' })
      .expect(200);

    expect(result.headers['set-cookie']).toEqual([
      `Authentication=123456; HttpOnly; Path=/; Max-Age=1800`,
      `Refresh=12345; HttpOnly; Path=/; Max-Age=86400`,
    ]);

    done();
  });

  afterAll(async () => {
    await app.close();
  });
});
