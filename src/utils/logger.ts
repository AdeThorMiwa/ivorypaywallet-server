import winston from 'winston';
import config from 'config';

const logLevel = config.get<string>('logger.level');

const Logger = winston.createLogger({
  transports: [new winston.transports.Console()],
  level: logLevel,
});

export default Logger;
