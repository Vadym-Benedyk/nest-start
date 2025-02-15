import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RoleService } from '@/src/role/role.service';
import { RoleModel } from '@/src/role/model/role.model';
import { RoleController } from '@/src/role/role.controller';

@Module({
  imports: [SequelizeModule.forFeature([RoleModel])],
  providers: [RoleService],
  controllers: [RoleController],
  exports: [SequelizeModule, RoleService]
})
export class RoleModule {}
