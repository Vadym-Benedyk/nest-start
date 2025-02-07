import { Test, TestingModule } from '@nestjs/testing';
import { Post } from './post';

describe('Post', () => {
  let provider: Post;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Post],
    }).compile();

    provider = module.get<Post>(Post);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
