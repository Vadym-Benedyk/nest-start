import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '@/src/users/user.service';
import { RefreshModule } from '../refresh/refresh.module';
import { UserRoleModule } from '@/src/user-role/user-role.module';
import { GoogleModule } from '@/src/strategies/google/google.module';
import { LoggerModule } from '@/src/logger/logger.module';


@Module({
  imports: [ RefreshModule, UserRoleModule, GoogleModule, LoggerModule],
  providers: [AuthService, UserService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
