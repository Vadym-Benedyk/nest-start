import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PostModel } from '@/src/post/models/post.model';
import { CreatePostDto } from '@/src/post/dto/create-post.dto';
import { UpdatePostDto } from '@/src/post/dto/update-post.dto';
import { CreatePostInterface, PostInterface } from '@/src/post/interfaces/post.interface';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);

  constructor(
    @InjectModel(PostModel) private readonly postModel: typeof PostModel,
  ) {}

  private handleException(error: any, message: string) {
    this.logger.error(`${message}: ${error}`);

    if (error instanceof HttpException) {
      throw error;
    }

    throw new HttpException(
      'Internal server error',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  async getPosts(): Promise<PostInterface[]> {
    try {
      const posts = await this.postModel.findAll();
      if (posts.length === 0) {
        throw new HttpException('Posts not found', HttpStatus.NOT_FOUND);
      }
      return posts;
    } catch (error) {
      this.handleException(error, 'Failed to get posts');
    }
  }

  async createPost(createPostDto: CreatePostDto): Promise<CreatePostInterface> {
    try {
      return await this.postModel.create(createPostDto);
    } catch (error) {
      this.handleException(error, 'Failed to create post');
    }
  }

  async getPost(id: string): Promise<PostInterface> {
    try {
      const post = await this.postModel.findByPk(id);
      if (!post) {
        throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
      }
      return post;
    } catch (error) {
      this.handleException(error, 'Failed to get post');
    }
  }

  async updatePost(updatePostDto: UpdatePostDto): Promise<PostInterface> {
    try {
      const [updatedCount, updatedPosts] = await this.postModel.update(
        { title: updatePostDto.title, content: updatePostDto.content },
        { where: { id: updatePostDto.id }, returning: true }
      );

      if (updatedCount === 0) {
        throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
      }

      return updatedPosts[0];
    } catch (error) {
      this.handleException(error, 'Failed to update post');
    }
  }

  async deletePost(id: string): Promise<void> {
    try {
      const deletedCount = await this.postModel.destroy({ where: { id } });
      if (deletedCount === 0) {
        throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      this.handleException(error, 'Failed to delete post');
    }
  }
}
