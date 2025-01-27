import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { RefreshModule } from '../refresh/refresh.module';
import { PasswordModule } from '../password/password.module';

@Module({
  imports: [UserModule, RefreshModule, PasswordModule],
  providers: [AuthService, UserService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
