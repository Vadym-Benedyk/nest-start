import { Module } from '@nestjs/common';
import { SmsController } from './sms.controller';
import { PersonalInfoModule } from '@/src/personal-info/personal-info.module';
import { SmsService } from './sms.service';
import { PersonalInfoService } from '@/src/personal-info/personal-info.service';
import { Sms } from './sms';

@Module({
  imports: [PersonalInfoModule, SmsModule],
  controllers: [SmsController],
  providers: [Sms, SmsService],
  exports: [SmsService],
})
export class SmsModule {}
