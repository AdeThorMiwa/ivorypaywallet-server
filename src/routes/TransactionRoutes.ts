import { Router } from 'express';
import Container from 'typedi';
import { asyncHandler, throwValidationError } from '../utils';
import { Security } from '../middlewares';
import { SCOPES } from '../constants';
import { body, query } from 'express-validator';
import { TransactionType } from '../interfaces/transactions';
import { decimalValidator } from '../utils/decimal';
import TransactionController from '../controllers/TransactionController';

const router = Router();
const controller = Container.get<TransactionController>(TransactionController);

router.post(
  '/',
  Security.requireAuthentication([SCOPES.USER]),
  body('type').isIn([TransactionType.TRANSFER, TransactionType.WITHDRAW]),
  body('amount').custom(decimalValidator).withMessage('Invalid value'),
  body('to').trim().isString(),
  body('note').trim().isString().optional(),
  throwValidationError,
  asyncHandler(controller.initiateTransaction),
);

router.get(
  '/',
  Security.requireAuthentication([SCOPES.USER]),
  query('page').isNumeric(),
  query('limit').isNumeric(),
  throwValidationError,
  asyncHandler(controller.getAuthenticatedUserTransactions),
);

export default router;
