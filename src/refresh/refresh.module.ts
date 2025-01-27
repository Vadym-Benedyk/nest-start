import { Module } from '@nestjs/common';
import { RefreshService } from './refresh.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { RefreshToken } from './models/refresh.model';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forFeature([RefreshToken]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: process.env.JWT_ACCESS_EXPIRATION },
    }),
  ],
  providers: [RefreshService],
  exports: [RefreshService, SequelizeModule],
})
export class RefreshModule {}
