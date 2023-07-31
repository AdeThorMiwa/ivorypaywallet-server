import { AppLogger, ServerErrorHandler } from './utils';
import config from 'config';
import app from './app';

const host = config.get<string>('server.host');
const port = config.get<number>('server.port');

const server = app.listen(port, host, () =>
  AppLogger.info(`⚡️[server]: Server is running on PORT ${port}`),
);
ServerErrorHandler(server);
