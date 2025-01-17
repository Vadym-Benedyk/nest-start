import { Module } from '@nestjs/common';
import { RefreshService } from './refresh.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { RefreshToken } from './models/refresh.model';


@Module({
  imports: [SequelizeModule.forFeature([RefreshToken])],
  providers: [RefreshService],
  exports: [RefreshService, SequelizeModule],
})
export class RefreshModule {}
