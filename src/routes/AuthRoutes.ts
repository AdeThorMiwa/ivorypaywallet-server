import { Router } from 'express';
import Container from 'typedi';
import AuthController from '../controllers/AuthController';
import { asyncHandler, throwValidationError } from '../utils';
import { body } from 'express-validator';
// import { Security } from '../middlewares';
// import { SCOPES } from '../constants';

const router = Router();
const controller = Container.get<AuthController>(AuthController);

const emailValidator = body('email').isEmail().withMessage('Invalid or missing email');

router.post(
  '/',
  emailValidator,
  body('password').trim().isString(),
  throwValidationError,
  asyncHandler(controller.login),
);

router.post(
  '/invite',
  // Security.requireAuthentication([SCOPES.ADMIN]),
  emailValidator,
  throwValidationError,
  asyncHandler(controller.invite),
);

export default router;
