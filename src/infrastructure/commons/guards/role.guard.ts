import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtTokenService } from 'src/infrastructure/services/jwt/jwt.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtTokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = request.cookies['Authentication'];

    if (!token) {
      return false;
    }

    try {
      const decodedToken = await this.jwtService.checkToken(token);
      const userRoles: string[] = decodedToken.roles || [];

      return userRoles.some((role) => roles.includes(role));
    } catch (err) {
      return false;
    }
  }
}
