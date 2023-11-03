import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export interface IUserSession {
  id: number;
  username: string;
}

export interface UserRequest extends Request {
  user: IUserSession;
}

export const User = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    const request: UserRequest = context.switchToHttp().getRequest();
    return request.user;
  },
);
