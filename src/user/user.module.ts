import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './models/user.model';
import { PasswordModule } from '../password/password.module';

@Module({
  imports: [SequelizeModule.forFeature([User]), PasswordModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [SequelizeModule],
})
export class UserModule {}
