import { Injectable } from '@nestjs/common';
import { ILogger } from '@/src/logger/interface/logger.interface';
import { NativeLoggerService } from '@/src/logger/services/native-logger.service';
import { WinstonLoggerService } from '@/src/logger/services/winston-logger.service';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class LoggerFacadeService implements ILogger {
  private logger: ILogger;

  constructor(
    private readonly nativeLoggerService: NativeLoggerService,
    private readonly winstonLoggerService: WinstonLoggerService,
    private readonly configService: ConfigService
  ) {

    const loggerType = this.configService.get<string>('LOGGER');
    if (loggerType === 'winston') {
      this.logger = this.winstonLoggerService;
    } else {
      this.logger = this.nativeLoggerService;
    }
  }

  log(message: string, context?: string): void {
    this.logger.log(message, context);
  }

  error(message: string, trace?: string, context?: string): void {
    this.logger.error(message, trace, context);
  }

  warn(message: string, context?: string): void {
    this.logger.warn(message, context);
  }

  debug(message: string, context?: string): void {
    this.logger.debug(message, context);
  }

  verbose(message: string, context?: string): void {
    this.logger.verbose(message, context);
  }
}