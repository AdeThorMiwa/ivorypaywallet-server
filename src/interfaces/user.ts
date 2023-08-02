import { InviteUserRequestBody } from './auth';
import { IPaginatedRequest } from './util';

export interface CreateUserRequest {
  username: string;
  password: string;
}

export interface InviteAdminRequestBody extends InviteUserRequestBody {}

export enum UserType {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface CreateUserResponse {
  token: string;
}

export interface AdminListPayload extends IPaginatedRequest {}
export interface UserListPayload extends IPaginatedRequest {}

export interface UpdateStatusPayload {
  status: UserStatus;
}
