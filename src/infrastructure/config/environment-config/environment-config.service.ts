import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApplicationConfig } from 'src/domain/config/application.interface';

@Injectable()
export class EnvironmentConfigService implements ApplicationConfig {
  constructor(private configService: ConfigService) {}
  getAppPort(): number {
    return this.configService.get<number>('APP_PORT');
  }
  getJwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET');
  }
  getJwtExpirationTime(): string {
    return this.configService.get<string>('JWT_EXPIRATION');
  }
  getJwtRefreshSecret(): string {
    return this.configService.get<string>('JWT_REFRESH_SECRET');
  }
  getJwtRefreshExpirationTime(): string {
    return this.configService.get<string>('JWT_REFRESH_EXPIRATION');
  }
}
