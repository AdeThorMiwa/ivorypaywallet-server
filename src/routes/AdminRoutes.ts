import { Router } from 'express';
import Container from 'typedi';
import AdminController from '../controllers/AdminController';
import { asyncHandler, throwValidationError } from '../utils';
import { body } from 'express-validator';
import { Security } from '../middlewares';
import { SCOPES } from '../constants';

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
  Security.requireAuthentication([SCOPES.USER]),
  asyncHandler(controller.getAuthenticatedAdmin),
);

export default router;
