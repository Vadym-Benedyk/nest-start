import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PostModel } from '@/src/post/models/post.model';
import { CreatePostDto } from '@/src/post/dto/create-post.dto';
import {
  CreatePostInterface,
  PostInterface,
} from '@/src/post/interfaces/post.interface';
import { UserService } from '@/src/users/user.service';
import { TopicService } from '@/src/topic/topic.service';
import { AcceptPostDto } from '@/src/post/dto/accept-post.dto';
import { IdPostDto } from '@/src/post/dto/id-post.dto';
import { UpdatePostDto } from '@/src/post/dto/update-post.dto';


@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);
  constructor(
    @InjectModel(PostModel) private readonly postModel: typeof PostModel,
    private readonly userService: UserService,
    private readonly topicService: TopicService
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


  async createPost(acceptPostDto: AcceptPostDto): Promise<CreatePostInterface> {
    const isUser = await this.userService.checkUserById(acceptPostDto.userId);
    if(!isUser) {
      this.logger.warn('User not found in database')
      throw new HttpException('userId has not corresponds in database', HttpStatus.BAD_REQUEST)
    }

    const topic = await this.topicService.getTopicByName(acceptPostDto.topicName)
    if (!topic) {
      this.logger.error('Topic not found in database', HttpStatus.NOT_ACCEPTABLE)
    }

    const createPostDto: CreatePostDto = {
      ...acceptPostDto,
      topicId: topic.id,
    };

    delete (createPostDto as any).topicName;

    try {
      return await this.postModel.create(createPostDto);
    } catch (error) {
      this.logger.error(`Failed to create post: ${error}`);
      throw new HttpException(
        'Error while saving post',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


  async getPost(idPostDto: IdPostDto): Promise<PostInterface> {
    const post = await this.postModel.findByPk(idPostDto.id);
    if (!post) {
      throw new HttpException(
        "There isn't any post in database",
        HttpStatus.NOT_FOUND,
      );
    }
    return post;
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


  async deletePost(idPostDto: IdPostDto): Promise<void> {
    const post = await this.postModel.findByPk(idPostDto.id);
    if (!post) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    try {
      await post.destroy();
    } catch (error) {
      this.logger.error(`Failed to delete post: ${error}`);
      throw new HttpException(
        'Internal server error',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
