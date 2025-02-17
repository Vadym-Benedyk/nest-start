import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RoleService } from '@/src/role/role.service';
import { RoleModel } from '@/src/role/models/role.model';
import { RoleController } from '@/src/role/role.controller';
import { UserRoleModel } from '@/src/role/models/user-role.model';

@Module({
  imports: [SequelizeModule.forFeature([RoleModel, UserRoleModel])],
  providers: [RoleService],
  controllers: [RoleController],
  exports: [SequelizeModule, RoleService]
})
export class RoleModule {}
