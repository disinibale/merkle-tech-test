import { UserRepositoryDomain } from 'src/domain/repositories/users.interface';
import { IBcryptService } from '../../domain/adapters/bcrypt.interface';
import {
  IJwtService,
  IJwtServicePayload,
} from '../../domain/adapters/jwt.interface';

import { ApplicationConfig } from '../../domain/config/application.interface';
import { ILogger } from '../../domain/logger/logger.interface';

export class LoginFeature {
  constructor(
    private readonly logger: ILogger,
    private readonly jwtTokenService: IJwtService,
    private readonly appConfig: ApplicationConfig,
    private readonly userRepository: UserRepositoryDomain,
    private readonly bcryptService: IBcryptService,
  ) {}

  async getCookiesWithToken(username: string) {
    this.logger.log('Login Feature', `User ${username} have been logged in`);

    const payload: IJwtServicePayload = { username: username };
    const secret = this.appConfig.getJwtSecret();
    const expiresIn = this.appConfig.getJwtExpirationTime();
    const token = this.jwtTokenService.createToken(payload, secret, expiresIn);

    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.appConfig.getJwtExpirationTime()}`;
  }

  async getCookiesWithRefreshToken(username: string) {
    this.logger.log('Login Feature', `User ${username} have been logged in`);

    const payload: IJwtServicePayload = { username: username };
    const secret = this.appConfig.getJwtRefreshSecret();
    const expiresIn = this.appConfig.getJwtRefreshExpirationTime();
    const token = this.jwtTokenService.createToken(payload, secret, expiresIn);

    return `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.appConfig.getJwtRefreshExpirationTime()}`;
  }

  async validateUserLocalStrategy(username: string, password: string) {
    const user = await this.userRepository.userByUsername(username);

    if (!user) return null;

    const match = await this.bcryptService.compare(password, user.password);
    if (user && match) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userInfo } = user;
      return userInfo;
    }

    return null;
  }

  async validateUserJwtStrategy(username: string) {
    const user = await this.userRepository.userByUsername(username);

    if (user) {
      return user;
    }

    return null;
  }

  async getUserInformation(username) {
    const user = await this.userRepository.userByUsername(username);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...information } = user;

    return information;
  }

  async updateLoginTime(id: number) {
    await this.userRepository.updateUserById({
      id,
      data: {
        lastLogin: new Date(),
      },
    });
  }

  async setCurrentRefreshToken(refreshToken: string, id: number) {
    const currHashedRefreshToken = await this.bcryptService.hash(refreshToken);
    await this.userRepository.updateUserById({
      id,
      data: { hashRefreshToken: currHashedRefreshToken },
    });
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, username: string) {
    const user = await this.userRepository.userByUsername(username);
    if (!user) {
      return null;
    }

    const isRefreshTokenMatching = await this.bcryptService.compare(
      refreshToken,
      user.hashRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }

    return null;
  }
}
