import { forwardRef, Module } from '@nestjs/common';
import { RolePermissionsController } from './role-permissions.controller';
import { RolePermissions } from './role-permissions';
import { RolePermissionsService } from './role-permissions.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { RolePermissionsModel } from '@/src/role-permissions/models/role-permissions.model';
import { RoleModule } from '@/src/role/role.module';
import { PermissionModule } from '@/src/permission/permission.module';
import { RoleModel } from '@/src/role/models/role.model';
import { PermissionModel } from '@/src/permission/models/permission.model';
import { UserRoleModule } from '@/src/user-role/user-role.module';



@Module({
  imports: [SequelizeModule.forFeature([RolePermissionsModel, RoleModel, PermissionModel]),
    forwardRef(() => RoleModule),
    forwardRef(() => PermissionModule),
    forwardRef(() => UserRoleModule)
  ],
  controllers: [RolePermissionsController],
  providers: [RolePermissions, RolePermissionsService],
  exports: [RolePermissionsService],
})
export class RolePermissionsModule {}
