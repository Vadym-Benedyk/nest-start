import { Module } from '@nestjs/common';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { PermissionModel } from '@/src/permission/models/permition.model';

@Module({
  imports: [SequelizeModule.forFeature([PermissionModel])],
  controllers: [PermissionController],
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionModule {}
