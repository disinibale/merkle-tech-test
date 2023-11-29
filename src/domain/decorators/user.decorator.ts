import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { UserRequest } from 'src/infrastructure/commons/types/userRequest';

export const User = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    const request: UserRequest = context.switchToHttp().getRequest();
    return request.user;
  },
);
