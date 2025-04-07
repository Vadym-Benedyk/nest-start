import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PostDto } from '@/src/post/dto/post.dto';
import { PostService } from '@/src/post/post.service';
import { CreatePostInterface, PostInterface } from '@/src/post/interfaces/post.interface';
import { JwtAuthGuard } from '@/src/auth/guards/JwtAuthGuard';
import { CurrentUser } from '@/src/auth/decorators/current-user.decorator';
import { AcceptPostDto } from '@/src/post/dto/accept-post.dto';
import { IdPostDto } from '@/src/post/dto/id-post.dto';
import { UpdatePostDto } from '@/src/post/dto/update-post.dto';
import { PermissionsGuard } from '@/src/auth/guards/PermissionsGuard';
import { Permissions } from '@/src/auth/decorators/get-permission.decorator';
import { OwnerGuard } from '@/src/auth/guards/OwnerGuard';
import { ToLowercasePipe } from '@/src/post/pipe/to-lower-case.pipe';



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
  @ApiBearerAuth()
  @Permissions('create_post')
  @UseGuards(JwtAuthGuard, PermissionsGuard, OwnerGuard)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The post has been successfully created.',
    type: PostDto,
  })
  @Post()
  async createPost(
    @Body(new ToLowercasePipe(['title', 'content'])) acceptPostDto: AcceptPostDto,
    @CurrentUser('id') userId: string,
  ): Promise<CreatePostInterface> {
    acceptPostDto.userId = userId;
    return await this.postService.createPost( acceptPostDto );
  }



  @ApiOperation({
    summary: 'Get one post by Id',
    description: 'Get a post',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns a post',
    type: PostDto,
  })
  @Get(':id')
  async getPost(
    @Param('id') id: string,
  ): Promise<PostInterface> {
    return await this.postService.getPost(id);
  }



  @ApiOperation({
    summary: 'Update post',
    description: 'Update post',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Post updated successfully',
    type: PostDto,
  })
  @ApiBearerAuth()
  @Permissions('update_post')
  @UseGuards(JwtAuthGuard, PermissionsGuard, OwnerGuard)
  @Patch('/update')
  async updatePost(
    @Body(new ToLowercasePipe(['title', 'content', 'topicName'])) updatePostDto: UpdatePostDto,
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
  @ApiBearerAuth()
  @Permissions('delete_post')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Delete('/delete/:id')
  async deletePost(@Param('id') idPostDto: IdPostDto): Promise<void> {
    return await this.postService.deletePost(idPostDto);
  }
}
