import { Router } from 'express';
import Container from 'typedi';
import AdminController from '../controllers/AdminController';
import { asyncHandler, throwValidationError } from '../utils';
import { body, param } from 'express-validator';
import { Security } from '../middlewares';
import { SCOPES } from '../constants';
import { paginationValidator } from '../utils/pagination';
import { UserStatus } from '../interfaces';

const router = Router();
const controller = Container.get<AdminController>(AdminController);

const emailValidator = body('email').isEmail().withMessage('Invalid or missing email');

router.post(
  '/invite',
  Security.requireAuthentication([SCOPES.ADMIN]),
  emailValidator,
  throwValidationError,
  asyncHandler(controller.invite),
);

router.get(
  '/me',
  Security.requireAuthentication([SCOPES.ADMIN]),
  asyncHandler(controller.getAuthenticatedAdmin),
);

router.get(
  '/',
  Security.requireAuthentication([SCOPES.ADMIN]),
  paginationValidator,
  throwValidationError,
  asyncHandler(controller.getAuthenticatedAdmin),
);

router.get(
  '/:userId/status',
  Security.requireAuthentication([SCOPES.ADMIN]),
  param('userId').trim().isUUID(),
  body('status').trim().isIn(Object.keys(UserStatus)),
  throwValidationError,
  asyncHandler(controller.getAuthenticatedAdmin),
);

export default router;
