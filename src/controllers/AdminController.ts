import { Inject, Service } from 'typedi';
import { Request, Response } from 'express';
import AdminService from '../services/AdminService';
import { InviteAdminRequestBody } from '../interfaces';

@Service()
class AdminController {
  constructor(@Inject() readonly adminService: AdminService) {}

  public invite = async (req: Request, res: Response) => {
    const body = <InviteAdminRequestBody>req.body;
    const response = await this.adminService.sendAdminInvite(body.email);
    res.status(200).json(response);
  };
}

export default AdminController;
