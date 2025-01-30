import { Module } from '@nestjs/common';
import { UserModule } from '@/src/users/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '@/src/users/user.service';
import { RefreshModule } from '../refresh/refresh.module';

@Module({
  imports: [UserModule, RefreshModule],
  providers: [AuthService, UserService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
