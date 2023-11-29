import { Request } from 'express';

export interface IUserSession {
  id: number;
  username: string;
  roles: string[];
}

export interface UserRequest extends Request {
  user: IUserSession;
}
