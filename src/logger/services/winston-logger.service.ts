import { Injectable } from '@nestjs/common';
import { ILogger } from '@/src/logger/interface/logger.interface';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import * as winston from 'winston';
import chalk from 'chalk';



@Injectable()
export class WinstonLoggerService implements ILogger {
  private readonly logger: winston.Logger;

  constructor() {
    const consoleFormat = winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(({ level, message, timestamp, context }) => {
        let coloredLevel;
        let contextColor;
        switch (level) {
          case 'info':
            coloredLevel = chalk.green(level.toUpperCase());
            contextColor = chalk.bgGreen.black(` ${context} `);
            break;
          case 'warn':
            coloredLevel = chalk.yellow(level.toUpperCase());
            contextColor = chalk.bgYellow.black(` ${context} `);
            break;
          case 'error':
            coloredLevel = chalk.red(level.toUpperCase());
            contextColor = chalk.bgRed.white(` ${context} `);
            break;
          default:
            coloredLevel = chalk.white(level.toUpperCase());
            contextColor = chalk.gray(` ${context} `);
        }

        return `[${timestamp}] [${coloredLevel}]${context ? ` ${contextColor}` : ''} ${message}`;
      }),
    );


    const fileFormat = winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(({ level, message, timestamp, context }) => {
        return `[${timestamp}] [${level.toUpperCase()}]${context ? ` [${context}]` : ''} ${message}`;
      }),
    );

    this.logger = winston.createLogger({
      level: 'debug',
      transports: [
        new winston.transports.Console({
          format: consoleFormat,
        }),
        new DailyRotateFile({
          dirname: './src/logger/logs',
          filename: '%DATE%.log',
          datePattern: 'DD-MM-YYYY',
          maxSize: '10m',
          maxFiles: '7d',
          format: fileFormat,
        }),
      ],
    });
  }

  log(message: string, context?: string): void {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string): void {
    this.logger.error(`${message}${trace ? '\n' + trace : ''}`, { context });
  }

  warn(message: string, context?: string): void {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string): void {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: string): void {
    this.logger.verbose(message, { context });
  }
}