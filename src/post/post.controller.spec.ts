import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';
import { PostService } from '@/src/post/post.service';
import { CreatePostDto } from '@/src/post/dto/create-post.dto';
import { UpdatePostDto } from '@/src/post/dto/update-post.dto';
import { JwtAuthGuard } from '@/src/auth/guards/JwtAuthGuard';
import { SelfGuard } from '@/src/auth/guards/SelfGuard';
import { ExecutionContext } from '@nestjs/common';

describe('PostController', () => {
  let controller: PostController;
  let postService: PostService;

  const mockPostService = {
    getPosts: jest.fn(() => [
      { id: '1', title: 'First Post', content: 'Content 1' },
      { id: '2', title: 'Second Post', content: 'Content 2' },
    ]),
    getPost: jest.fn((id: string) => ({ id, title: 'Mock Post', content: 'Mock Content' })),
    createPost: jest.fn((dto: CreatePostDto) => ({
      id: '1',
      ...dto,
    })),
    updatePost: jest.fn((dto: UpdatePostDto) => ({
      id: dto.id,
      ...dto,
    })),
    deletePost: jest.fn((id: string) => undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [{ provide: PostService, useValue: mockPostService }],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: (context: ExecutionContext) => true })
      .overrideGuard(SelfGuard)
      .useValue({ canActivate: (context: ExecutionContext) => true })
      .compile();

    controller = module.get<PostController>(PostController);
    postService = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getPosts', () => {
    it('should return an array of posts', async () => {
      const result = await controller.getPosts();
      expect(result).toEqual([
        { id: '1', title: 'First Post', content: 'Content 1' },
        { id: '2', title: 'Second Post', content: 'Content 2' },
      ]);
      expect(postService.getPosts).toHaveBeenCalledTimes(1);
    });
  });

  describe('getPost', () => {
    it('should return a single post', async () => {
      const result = await controller.getPost('1');
      expect(result).toEqual({
        id: '1',
        title: 'Mock Post',
        content: 'Mock Content',
      });
      expect(postService.getPost).toHaveBeenCalledWith('1');
    });
  });

  describe('createPost', () => {
    it('should create a post and return it', async () => {
      const dto: CreatePostDto = { title: 'New Post', content: 'New Content', userId: '123' };
      const result = await controller.createPost(dto);
      expect(result).toEqual({
        id: '1',
        ...dto,
      });
      expect(postService.createPost).toHaveBeenCalledWith(dto);
    });
  });

  describe('updatePost', () => {
    it('should update a post and return updated post', async () => {
      const dto: UpdatePostDto = { id: '1', title: 'Updated Post', content: 'Updated Content' };
      const result = await controller.updatePost(dto);
      expect(result).toEqual(dto);
      expect(postService.updatePost).toHaveBeenCalledWith(dto);
    });
  });

  describe('deletePost', () => {
    it('should delete a post', async () => {
      await controller.deletePost('1');
      expect(postService.deletePost).toHaveBeenCalledWith('1');
    });
  });
});