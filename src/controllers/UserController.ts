import { Inject, Service } from 'typedi';
import { Request, Response } from 'express';
import UserService from '../services/UserService';
import { CreateUserRequest, CreateUserResponse, UserListPayload } from '../interfaces/user';
import { AuthRequest } from '../interfaces';
import { Forbidden } from 'http-errors';
import AdminService from '../services/AdminService';

@Service()
class UserController {
  constructor(
    @Inject() readonly userService: UserService,
    @Inject() readonly adminService: AdminService,
  ) {}

  public createUser = async (req_: Request, res: Response) => {
    const req = <AuthRequest>req_;
    const email = this._getEmailFromRequest(req);
    const body = <CreateUserRequest>req.body;
    let response: CreateUserResponse;
    if (req.auth.isAdmin) {
      response = await this.adminService.createAdmin(email, body.username, body.password);
    } else {
      response = await this.userService.createUser(email, body.username, body.password);
    }

    res.status(201).json(response);
  };

  public getAuthenticatedUser = async (req: Request, res: Response) => {
    const userId = this._getUserIdFromRequest(<AuthRequest>req);
    const response = await this.userService.getUserById(userId);
    res.status(200).json(response);
  };

  private _getEmailFromRequest = (req: AuthRequest): string => {
    if (!req.auth.email) {
      throw new Forbidden('Could not authenticate');
    }
    return req.auth.email;
  };

  public getUserList = async (req: Request, res: Response) => {
    const body = <UserListPayload>req.body;
    const response = await this.userService.getUsers(body.page, body.limit, body.desc);
    res.status(200).json(response);
  };

  private _getUserIdFromRequest = (req: AuthRequest): string => {
    if (!req.auth.userId) {
      throw new Forbidden('Could not authenticate');
    }
    return req.auth.userId;
  };
}

export default UserController;
