import { Module } from '@nestjs/common';
import { GoogleStrategy } from './google.strategy';
import { GoogleController } from './google.controller';
import { GoogleService } from './google.service';
import { AuthService } from '../../auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { Google } from './google';
import { UserModule } from '@/src/users/user.module';
import { RefreshModule } from '@/src/refresh/refresh.module';
import { UserRoleModule } from '@/src/user-role/user-role.module';

@Module({
  imports: [
    ConfigModule,
    UserModule,
    RefreshModule,
    UserRoleModule,
    JwtModule.register({
    global: true,
    secret: process.env.JWT_SECRET || 'secret',
    signOptions: { expiresIn: process.env.JWT_ACCESS_EXPIRATION },
  }),
  ],
  controllers: [GoogleController],
  providers: [GoogleStrategy, GoogleService],
  exports: [GoogleService],
})
export class GoogleModule {}