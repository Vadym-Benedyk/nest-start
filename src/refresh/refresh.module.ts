import { Module } from '@nestjs/common';
import { RefreshService } from './refresh.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { RefreshToken } from './models/refresh.model';
import { JwtModule } from '@nestjs/jwt';



@Module({
  imports: [
    SequelizeModule.forFeature([RefreshToken]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: '360s' },
    }),
  ],
  providers: [RefreshService],
  exports: [RefreshService, SequelizeModule],
})
export class RefreshModule {}
