import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { PostModel } from '@/src/post/models/post.model';
import { PostService } from '@/src/post/post.service';
import { PostController } from '@/src/post/post.controller';
import { UserModule } from '@/src/users/user.module';

@Module({
  imports: [SequelizeModule.forFeature([PostModel]), UserModule],
  providers: [PostService],
  controllers: [PostController],
  exports: [SequelizeModule, PostService],
})
export class PostModule {}
