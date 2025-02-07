import { Module } from '@nestjs/common';
import { ResetPasswordController } from './reset-password.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ResetTokenModel } from '@/src/reset-password/models/reset-token.model';
import { UserModule } from '@/src/users/user.module';
import { ResetPasswordService } from '@/src/reset-password/reset-password.service';
import { MailService } from '@/src/mail/mail.service';
import { MailModule } from '@/src/mail/mail.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: false,
    }),
    SequelizeModule.forFeature([ResetTokenModel]),
    UserModule,
    MailModule,
  ],
  providers: [ResetPasswordService, MailService],
  controllers: [ResetPasswordController],
  exports: [SequelizeModule, ResetPasswordService],
})
export class ResetPasswordModule {}
