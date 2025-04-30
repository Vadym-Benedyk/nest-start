import { Module } from '@nestjs/common';
import { Phone } from './phone';
import { PhoneService } from './phone.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { PhoneModel } from '@/src/phone/models/phone.model';
import { UserModule } from '@/src/users/user.module';
import { PhoneController } from '@/src/phone/phone.controller';
import { SmsModule } from '@/src/sms/sms.module';
import { UserRoleModule } from '@/src/user-role/user-role.module';
import { PermissionModule } from '@/src/permission/permission.module';
import { LoggerModule } from '@/src/logger/logger.module';

@Module({
  imports: [SequelizeModule.forFeature([PhoneModel]), UserModule, SmsModule, UserRoleModule, PermissionModule, LoggerModule],
  controllers: [PhoneController],
  providers: [Phone, PhoneService],
  exports: [PhoneService],
})
export class PhoneModule {}
