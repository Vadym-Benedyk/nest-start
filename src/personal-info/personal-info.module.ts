import { Module } from '@nestjs/common';
import { PersonalInfoService } from './personal-info.service';
import { PersonalInfoController } from '@/src/personal-info/personal-info.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { PersonalInfoModel } from '@/src/personal-info/models/personal-info.model';
import { UserModule } from '@/src/users/user.module';



@Module({
  imports: [SequelizeModule.forFeature([PersonalInfoModel]), UserModule],
  providers: [PersonalInfoService],
  controllers: [PersonalInfoController],
  exports: [PersonalInfoService],
})
export class PersonalInfoModule {}
