import { Test, TestingModule } from '@nestjs/testing';
import { Chapter } from './chapter';

describe('Chapter', () => {
  let provider: Chapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Chapter],
    }).compile();

    provider = module.get<Chapter>(Chapter);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
