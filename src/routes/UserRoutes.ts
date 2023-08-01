import { Router } from 'express';
import Container from 'typedi';
import UserController from '../controllers/UserController';
import { asyncHandler, throwValidationError } from '../utils';
import { body } from 'express-validator';
import { Security } from '../middlewares';
import { SCOPES } from '../constants';

const router = Router();
const controller = Container.get<UserController>(UserController);

router.post(
  '/',
  Security.requireAuthentication([SCOPES.INVITE]),
  body('username').trim().isString().isLength({ min: 3, max: 50 }),
  body('password').trim().isStrongPassword(),
  throwValidationError,
  asyncHandler(controller.createUser),
);

router.get('/me', Security.requireAuthentication([SCOPES.USER]), asyncHandler(controller.getAuthenticatedUser))

export default router;
