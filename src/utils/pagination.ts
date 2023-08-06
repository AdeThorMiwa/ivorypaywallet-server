import config from 'config';
import { query } from 'express-validator';

export const getPaginationConfig = (page?: number, limit?: number) => {
  const take = limit || config.get<number>('pagination.limit');
  page = page || 1;
  const skip = (page - 1) * take;
  return [take, skip];
};

export const paginateResponse = (data: unknown[], total: number, page?: number, limit?: number) => {
  page = page || 1;
  const lastPage = Math.ceil(total / (limit || config.get<number>('pagination.limit')));
  const nextPage = page + 1 > lastPage ? null : page + 1;
  const prevPage = page - 1 < 1 ? null : page - 1;
  return {
    data,
    total,
    currentPage: page,
    nextPage: nextPage,
    prevPage: prevPage,
    lastPage: lastPage,
  };
};

export const paginationValidator = [
  query('page').isNumeric().optional(),
  query('limit').isNumeric().optional(),
  query('desc').trim().isBoolean().optional(),
];
