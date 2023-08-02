import { Inject, Service } from 'typedi';
import { Request, Response } from 'express';
import AdminService from '../services/AdminService';
import {
  AdminListPayload,
  AuthRequest,
  InviteAdminRequestBody,
  UpdateStatusPayload,
} from '../interfaces';
import { Forbidden } from 'http-errors';
import UserService from '../services/UserService';

@Service()
class AdminController {
  constructor(
    @Inject() readonly adminService: AdminService,
    @Inject() readonly userService: UserService,
  ) {}

  public invite = async (req: Request, res: Response) => {
    const body = <InviteAdminRequestBody>req.body;
    const response = await this.adminService.sendAdminInvite(body.email);
    res.status(200).json(response);
  };

  public getAuthenticatedAdmin = async (req: Request, res: Response) => {
    const userId = this._getAdminIdFromRequest(<AuthRequest>req);
    const response = await this.adminService.getAdminById(userId);
    res.status(200).json(response);
  };

  public getAdminList = async (req: Request, res: Response) => {
    const body = <AdminListPayload>req.body;
    const response = await this.adminService.getAdmins(body.page, body.limit, body.desc);
    res.status(200).json(response);
  };

  public updatedUserStatus = async (req: Request, res: Response) => {
    const body = <UpdateStatusPayload>req.body;
    const response = await this.adminService.updateUserStatus(req.params.userId, body.status);
    res.status(200).json(response);
  };

  private _getAdminIdFromRequest = (req: AuthRequest): string => {
    if (!req.auth.userId) {
      throw new Forbidden('Could not authenticate');
    }
    return req.auth.userId;
  };
}

export default AdminController;
