import { Test, TestingModule } from '@nestjs/testing';
import { Topic } from './topic';

describe('Topic', () => {
  let provider: Topic;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Topic],
    }).compile();

    provider = module.get<Topic>(Topic);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
