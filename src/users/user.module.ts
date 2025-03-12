import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './models/user.model';
import { UserRoleModule } from '@/src/user-role/user-role.module';


@Module({
  imports: [SequelizeModule.forFeature([User]), forwardRef(() => UserRoleModule)],
  providers: [UserService],
  controllers: [UserController],
  exports: [SequelizeModule, UserService],
})
export class UserModule {}
