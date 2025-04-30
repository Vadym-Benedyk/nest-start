import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PostModel } from '@/src/post/models/post.model';
import { PostService } from '@/src/post/post.service';
import { PostController } from '@/src/post/post.controller';
import { UserModule } from '@/src/users/user.module';
import { TopicModule } from '@/src/topic/topic.module';
import { UserRoleModule } from '@/src/user-role/user-role.module';
import { PermissionModule } from '@/src/permission/permission.module';
import { LoggerModule } from '@/src/logger/logger.module';

@Module({
  imports: [SequelizeModule.forFeature([PostModel]), UserModule, TopicModule, UserRoleModule, PermissionModule, LoggerModule],
  providers: [PostService],
  controllers: [PostController],
  exports: [SequelizeModule, PostService],
})
export class PostModule {}
