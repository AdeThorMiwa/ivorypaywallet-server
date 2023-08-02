import { InviteUserRequestBody } from './auth';

export interface CreateUserRequest {
  username: string;
  password: string;
}

export interface InviteAdminRequestBody extends InviteUserRequestBody {}

export enum UserType {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface CreateUserResponse {
  token: string;
}
