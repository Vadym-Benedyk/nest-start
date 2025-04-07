import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailService } from '@/src/mail/mail.service';
import { LoggerModule } from '@/src/logger/logger.module';

@Module({
  imports: [ConfigModule, LoggerModule],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}