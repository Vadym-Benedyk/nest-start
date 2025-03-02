import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@/src/users/models/user.model';
import { UserRoleModel } from '@/src/user-role/models/user-role.model';
import { UserRoleService } from '@/src/user-role/user-role.service';
import { UserRoleController } from '@/src/user-role/user-role.controller';
import { RoleModule } from '@/src/role/role.module';
import { UserModule } from '@/src/users/user.module';



@Module({
  imports: [
    SequelizeModule.forFeature([UserRoleModel, User]),
    forwardRef(() => RoleModule),
    forwardRef(() => UserModule) // <-- Додано імпорт UserModule
  ],
  providers: [UserRoleService],
  controllers: [UserRoleController],
  exports: [SequelizeModule, UserRoleService]
})
export class UserRoleModule {}