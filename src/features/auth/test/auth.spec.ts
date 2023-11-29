import { ILogger } from 'src/domain/logger/logger.interface';
import { IsAuthenticatedFeature } from '../isAuthenticated.feature';
import { LoginFeature } from '../login.feature';
import { LogoutFeature } from '../logout.feature';
import { IJwtService } from 'src/domain/adapters/jwt.interface';
import { ApplicationConfig } from 'src/domain/config/application.interface';
import { UsersRepository } from 'src/infrastructure/repositories/users.repository';
import { IBcryptService } from 'src/domain/adapters/bcrypt.interface';

describe('Feature/Authentication', () => {
  let loginFeature: LoginFeature;
  let logoutFeature: LogoutFeature;
  let isAuthenticated: IsAuthenticatedFeature;
  let logger: ILogger;
  let jwtService: IJwtService;
  let appConfig: ApplicationConfig;
  let userRepository: UsersRepository;
  let bcryptService: IBcryptService;

  beforeEach(() => {
    logger = {} as ILogger;
    logger.log = jest.fn();

    jwtService = {} as IJwtService;
    jwtService.createToken = jest.fn();

    appConfig = {} as ApplicationConfig;
    appConfig.getJwtSecret = jest.fn();
    appConfig.getJwtExpirationTime = jest.fn();
    appConfig.getJwtRefreshSecret = jest.fn();
    appConfig.getJwtRefreshExpirationTime = jest.fn();

    userRepository = {} as UsersRepository;
    userRepository.userByUsername = jest.fn();
    userRepository.updateUserById = jest.fn();

    bcryptService = {} as IBcryptService;
    bcryptService.compare = jest.fn();
    bcryptService.hash = jest.fn();

    loginFeature = new LoginFeature(
      logger,
      jwtService,
      appConfig,
      userRepository,
      bcryptService,
    );
    logoutFeature = new LogoutFeature();
    isAuthenticated = new IsAuthenticatedFeature(userRepository);
  });

  describe('Validation with local strategy', () => {
    it('should return null because user not found', async () => {
      (userRepository.userByUsername as jest.Mock).mockReturnValue(
        Promise.resolve(null),
      );

      expect(
        await loginFeature.validateUserLocalStrategy('username', 'password'),
      ).toEqual(null);
    });
    it('should return user without password', async () => {
      const user = {
        id: 1,
        username: 'username',
        password: 'password',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLogin: null,
        hashRefreshToken: 'refreshToken',
      };
      (userRepository.userByUsername as jest.Mock).mockReturnValue(
        Promise.resolve(user),
      );
      (bcryptService.compare as jest.Mock).mockReturnValue(
        Promise.resolve(true),
      );

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = user;

      expect(
        await loginFeature.validateUserLocalStrategy('username', 'password'),
      ).toEqual(rest);
    });
  });
  describe('Validation with jwt strategy', () => {
    it('should return null because user not found', async () => {
      (userRepository.userByUsername as jest.Mock).mockReturnValue(
        Promise.resolve(null),
      );
      (bcryptService.compare as jest.Mock).mockReturnValue(
        Promise.resolve(false),
      );

      expect(await loginFeature.validateUserJwtStrategy('username')).toEqual(
        null,
      );
    });

    it('should return user', async () => {
      const user = {
        id: 1,
        username: 'username',
        password: 'password',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLogin: null,
        hashRefreshToken: 'refreshToken',
      };
      (userRepository.userByUsername as jest.Mock).mockReturnValue(
        Promise.resolve(user),
      );
      expect(await loginFeature.validateUserJwtStrategy('username')).toEqual(
        user,
      );
    });
  });
  describe('Validation with refresh token', () => {
    it('should return null because user not found', async () => {
      (userRepository.userByUsername as jest.Mock).mockReturnValue(
        Promise.resolve(null),
      );
      expect(
        await loginFeature.getUserIfRefreshTokenMatches(
          'refresh token',
          'username',
        ),
      ).toEqual(null);
    });

    it('should return user', async () => {
      const user = {
        id: 1,
        username: 'username',
        password: 'password',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLogin: null,
        hashRefreshToken: 'refresh token',
      };
      (userRepository.userByUsername as jest.Mock).mockReturnValue(
        Promise.resolve(user),
      );
      (bcryptService.compare as jest.Mock).mockReturnValue(
        Promise.resolve(false),
      );
      expect(
        await loginFeature.getUserIfRefreshTokenMatches(
          'refresh token',
          'username',
        ),
      ).toEqual(null);
    });
  });
  describe('Logout', () => {
    it('should return an array to invalid the cookie', async () => {
      expect(await logoutFeature.execute()).toEqual([
        'Authentication=; HttpOnly; Path=/; Max-Age=0',
        'Refresh=; HttpOnly; Path=/; Max-Age=0',
      ]);
    });
  });
  describe('Is Authenticated', () => {
    it('should return array to invalid the cookie', async () => {
      const user = {
        id: 1,
        username: 'username',
        password: 'password',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLogin: null,
        hashRefreshToken: 'refresh token',
      };
      (userRepository.userByUsername as jest.Mock).mockReturnValue(
        Promise.resolve(user),
      );

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = user;

      expect(await isAuthenticated.execute('username')).toEqual(user);
    });
  });
});
