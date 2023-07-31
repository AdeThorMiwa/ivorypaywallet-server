import { Router } from 'express';
import Container from 'typedi';
import AuthController from '../controllers/AuthController';
import { catcher, throwValidationError } from '../utils';
import { body } from 'express-validator';

const router = Router();
const controller = Container.get<AuthController>(AuthController);

router.post('/');
router.post(
  '/invite',
  /** TODO: require admin scope */ body('email').isEmail().withMessage('Invalid or missing email'),
  throwValidationError,
  catcher(controller.invite),
);

export default router;
