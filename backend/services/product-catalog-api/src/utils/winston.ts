import {
  createLogger,
  Logger,
  LoggerOptions,
  format,
  transports,
} from 'winston';
import { config } from './';

const consoleTransport: transports.ConsoleTransportInstance = new transports.Console({
  level: config.utils.logLevel,
  format: format.combine(
    format.colorize(),
    format.simple())
});

const loggerOptions: LoggerOptions = {
  level: config.utils.logLevel,
  defaultMeta: {
    service: config.utils.serviceName
  },
  transports: [consoleTransport],
};

const logger: Logger = createLogger(loggerOptions);
export { logger };
