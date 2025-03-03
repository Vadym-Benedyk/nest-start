import { Module } from '@nestjs/common';
import { PermissionController } from './permission.controller';
import { PermissionService } from './permission.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { RolePermissionsModel } from '@/src/role-permissions/models/role-permissions.model';
import { RoleModel } from '@/src/role/models/role.model';
import { PermissionModel } from '@/src/permission/models/permission.model';

@Module({
  imports: [SequelizeModule.forFeature([PermissionModel, RoleModel, RolePermissionsModel])],
  controllers: [PermissionController],
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionModule {}
