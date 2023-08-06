import { Router } from 'express';
import Container from 'typedi';
import { asyncHandler, throwValidationError } from '../utils';
import { Security } from '../middlewares';
import { SCOPES } from '../constants';
import { body, param } from 'express-validator';
import { TransactionType } from '../interfaces/transactions';
import { decimalValidator } from '../utils/decimal';
import TransactionController from '../controllers/TransactionController';
import { paginationValidator } from '../utils/pagination';

const router = Router();
const controller = Container.get<TransactionController>(TransactionController);

router.post(
  '/',
  Security.requireAuthentication([SCOPES.USER]),
  body('type').isIn([TransactionType.TRANSFER, TransactionType.WITHDRAW]),
  body('amount').custom(decimalValidator).withMessage('Invalid amount'),
  body('to').trim().isString(),
  body('note').trim().isString(),
  throwValidationError,
  asyncHandler(controller.initiateTransaction),
);

router.get(
  '/',
  Security.requireAuthentication([SCOPES.USER]),
  paginationValidator,
  throwValidationError,
  asyncHandler(controller.getAuthenticatedUserTransactions),
);

router.get(
  '/:transactionId',
  Security.requireAuthentication([SCOPES.USER]),
  param('transactionId').isUUID().withMessage('Invalid transaction id'),
  throwValidationError,
  asyncHandler(controller.getTransactionById),
);

export default router;
