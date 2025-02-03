import { Module } from '@nestjs/common';
import { ResetPasswordController } from './reset-password.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ResetTokenModel } from '@/src/reset-password/models/reset-token';
import { UserModule } from '@/src/users/user.module';
import { ResetPasswordService } from '@/src/reset-password/reset-password.service';

@Module({
  imports: [
    SequelizeModule.forFeature([ResetTokenModel]),
    UserModule
  ],
  providers: [ResetPasswordService],
  controllers: [ResetPasswordController],
  exports: [ResetPasswordService],
})
export class ResetPasswordModule {}
