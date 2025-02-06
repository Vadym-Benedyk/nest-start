import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PostModel } from '@/src/post/models/post.model';
import { CreatePostDto } from '@/src/post/dto/create-post.dto';
import {
  CreatePostInterface,
  PostInterface,
} from '@/src/post/interfaces/post.interface';
import { UpdatePostDto } from '@/src/post/dto/update-post.dto';


@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);
  constructor(
    @InjectModel(PostModel) private readonly postModel: typeof PostModel,
  ) {}

  async getPosts(): Promise<PostInterface[]> {
    try {
      const posts = await this.postModel.findAll();
      if (posts.length === 0) {
        throw new HttpException('Posts not found', HttpStatus.NOT_FOUND);
      }

      return posts;
    } catch (error) {
      this.logger.error(`Failed to get posts: ${error}`);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createPost(createPostDto: CreatePostDto): Promise<CreatePostInterface> {
    try {
      return await this.postModel.create(createPostDto);
    } catch (error) {
      this.logger.error(`Failed to create post: ${error}`);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getPost(id: string): Promise<PostInterface> {
    try {
      const post = await this.postModel.findByPk(id);
      if (!post) {
        throw new HttpException(
          "There isn't any post in database",
          HttpStatus.NOT_FOUND,
        );
      }
      return post;
    } catch (error) {
      this.logger.error(`Failed to get post: ${error}`);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updatePost(updatePostDto: UpdatePostDto): Promise<PostInterface> {
    try {
      const post = await this.postModel.findByPk(updatePostDto.id);
      if (!post) {
        throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
      }
      post.title = updatePostDto.title;
      post.content = updatePostDto.content;
      post.updatedAt = new Date();

      return await post.save();
    } catch (error) {
      this.logger.error(`Failed to update post: ${error}`);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deletePost(id: string): Promise<void> {
    try {
      const post = await this.postModel.findByPk(id);
      if (!post) {
        throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
      }
      await post.destroy();
    } catch (error) {
      this.logger.error(`Failed to delete post: ${error}`);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
