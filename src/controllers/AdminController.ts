import { Inject, Service } from 'typedi';
import { Request, Response } from 'express';
import AdminService from '../services/AdminService';
import { AuthRequest, InviteAdminRequestBody } from '../interfaces';
import { Forbidden } from 'http-errors';

@Service()
class AdminController {
  constructor(@Inject() readonly adminService: AdminService) {}

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

  private _getAdminIdFromRequest = (req: AuthRequest): string => {
    if (!req.auth.userId) {
      throw new Forbidden('Could not authenticate');
    }
    return req.auth.userId;
  };
}

export default AdminController;
