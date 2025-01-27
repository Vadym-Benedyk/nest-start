import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PasswordService } from './password.service';
import { PasswordModel } from './models/password.model';

@Module({
  imports: [SequelizeModule.forFeature([PasswordModel])],
  providers: [PasswordService],
  exports: [PasswordService, SequelizeModule],
})
export class PasswordModule {}
