import { Test, TestingModule } from '@nestjs/testing';
import { PersonalInfo } from './personal-info';

describe('PersonalInfo', () => {
  let provider: PersonalInfo;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PersonalInfo],
    }).compile();

    provider = module.get<PersonalInfo>(PersonalInfo);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
