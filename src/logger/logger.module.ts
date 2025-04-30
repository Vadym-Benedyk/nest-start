
import { Module } from '@nestjs/common';
import { WinstonLoggerService } from '@/src/logger/services/winston-logger.service';
import { NativeLoggerService } from '@/src/logger/services/native-logger.service';
import { LoggerFacadeService } from '@/src/logger/logger-facade.service';

@Module({
  providers: [
    WinstonLoggerService,
    NativeLoggerService,
    LoggerFacadeService,
  ],
  exports: [LoggerFacadeService],
})
export class LoggerModule {}