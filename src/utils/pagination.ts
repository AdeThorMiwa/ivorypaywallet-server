import config from 'config';

export const getPaginationConfig = (page: number, limit?: number) => {
  const take = limit || config.get<number>('pagination.limit');
  page = page || 1;
  const skip = (page - 1) * take;
  return [take, skip];
};

export const paginateResponse = (data: unknown[], total: number, page: number, limit: number) => {
  const lastPage = Math.ceil(total / limit);
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
