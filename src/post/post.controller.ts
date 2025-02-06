import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PostDto } from '@/src/post/dto/post.dto';
import { PostService } from '@/src/post/post.service';
import { CreatePostDto } from '@/src/post/dto/create-post.dto';
import {
  CreatePostInterface,
  PostInterface,
} from '@/src/post/interfaces/post.interface';
import { UpdatePostDto } from '@/src/post/dto/update-post.dto';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiOperation({
    summary: 'Get all posts',
    description: 'Get posts',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns an array of posts',
    type: PostDto,
  })
  @Get()
  async getPosts(): Promise<PostInterface[]> {
    return await this.postService.getPosts();
  }

  @ApiOperation({
    summary: 'Create a post',
    description: 'Create a post',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The post has been successfully created.',
    type: PostDto,
  })
  @Post()
  async createPost(
    @Body() createPostDto: CreatePostDto,
  ): Promise<CreatePostInterface> {
    return await this.postService.createPost(createPostDto);
  }

  @ApiOperation({
    summary: 'Get one post',
    description: 'Get post',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns a post',
    type: PostDto,
  })
  @Get(':id')
  async getPost(id: string): Promise<PostInterface> {
    return await this.postService.getPost(id);
  }

  @ApiOperation({
    summary: 'Update post',
    description: 'Update post',
  })
  @Patch('/update')
  async updatePost(
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostInterface> {
    return await this.postService.updatePost(updatePostDto);
  }

  @ApiOperation({
    summary: 'Delete post',
    description: 'Delete post',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Post deleted successfully',
  })
  @Delete('/delete/:id')
  async deletePost(@Param('id') id: string): Promise<void> {
    return await this.postService.deletePost(id);
  }
}
