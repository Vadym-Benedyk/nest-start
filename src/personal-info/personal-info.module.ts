import { Module } from '@nestjs/common';
import { PersonalInfoService } from './personal-info.service';
import { PersonalInfoController } from '@/src/personal-info/personal-info.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { PersonalInfoModel } from '@/src/personal-info/models/personal-info.model';
import { UserModule } from '@/src/users/user.module';
import { UserRoleModule } from '@/src/user-role/user-role.module';
import { PermissionModule } from '@/src/permission/permission.module';
import { LoggerModule } from '@/src/logger/logger.module';




@Module({
  imports: [SequelizeModule.forFeature([PersonalInfoModel]), UserModule, UserRoleModule, PermissionModule, LoggerModule],
  controllers: [PersonalInfoController],
  providers: [PersonalInfoService],
  exports: [PersonalInfoService],
})
export class PersonalInfoModule {}
