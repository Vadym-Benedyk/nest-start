import { Test, TestingModule } from '@nestjs/testing';
import { Password } from './password';

describe('Password', () => {
  let provider: Password;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Password],
    }).compile();

    provider = module.get<Password>(Password);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
