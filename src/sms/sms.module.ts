import { Module } from '@nestjs/common';
import { SmsController } from './sms.controller';
import { PersonalInfoModule } from '@/src/personal-info/personal-info.module';
import { SmsService } from './sms.service';
import { Sms } from './sms';
import { PermissionModule } from '@/src/permission/permission.module';
import { UserRoleModule } from '@/src/user-role/user-role.module';
import { LoggerModule } from '@/src/logger/logger.module';

@Module({
  imports: [PersonalInfoModule, SmsModule, UserRoleModule, PermissionModule, LoggerModule],
  controllers: [SmsController],
  providers: [Sms, SmsService],
  exports: [SmsService],
})
export class SmsModule {}
