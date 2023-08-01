import { Router } from 'express';
import Container from 'typedi';
import { asyncHandler } from '../utils';
import { Security } from '../middlewares';
import { SCOPES } from '../constants';
import WalletController from '../controllers/WalletController';

const router = Router();
const controller = Container.get<WalletController>(WalletController);

router.get(
  '/',
  Security.requireAuthentication([SCOPES.USER]),
  asyncHandler(controller.getAuthenticatedUserWallet),
);

export default router;
