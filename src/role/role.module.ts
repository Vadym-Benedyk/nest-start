import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RoleService } from '@/src/role/role.service';
import { RoleModel } from '@/src/role/models/role.model';
import { RoleController } from '@/src/role/role.controller';
import { RolePermissionsModel } from '@/src/role-permissions/models/role-permissions.model';
import { PermissionModel } from '@/src/permission/models/permission.model';
import { UserRoleModule } from '@/src/user-role/user-role.module';


@Module({
  imports: [SequelizeModule.forFeature([RoleModel, RolePermissionsModel, PermissionModel]),
    forwardRef(() => UserRoleModule)
  ],
  providers: [RoleService],
  controllers: [RoleController],
  exports: [SequelizeModule, RoleService]
})
export class RoleModule {}
