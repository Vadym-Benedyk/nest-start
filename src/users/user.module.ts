import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './models/user.model';
import { RoleModel } from '@/src/role/models/role.model';
import { UserRoleModel } from '@/src/role/models/user-role.model';

@Module({
  imports: [SequelizeModule.forFeature([User, RoleModel, UserRoleModel])],
  providers: [UserService],
  controllers: [UserController],
  exports: [SequelizeModule, UserService],
})
export class UserModule {}
