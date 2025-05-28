import { LoggerService } from '@nestjs/common';
import { createLogger, transports, format } from 'winston';

// INFO: initial basic logger
// TODO: add additional transports
export class WinstonLogger implements LoggerService {
  private logger;

  constructor(serviceName = 'Nest-Server') {
    this.logger = createLogger({
      transports: [
        new transports.Console({
          level: 'debug',
          format: format.combine(
            format.timestamp(),
            format.colorize(),
            format.printf(({ level, message, timestamp }) => {
              return `${timestamp} [${level}] - ${serviceName} :: ${message}`;
            }),
          ),
        }),
      ],
      exitOnError: false,
    });
  }

  getLogger() {
    return this.logger;
  }

  log(message: string) {
    this.logger.info(message);
  }

  error(message: string, trace?: string) {
    this.logger.error(message, trace);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }
}
