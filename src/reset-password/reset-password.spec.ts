import { Test, TestingModule } from '@nestjs/testing';
import { ResetPassword } from './reset-password';

describe('ResetPassword', () => {
  let provider: ResetPassword;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResetPassword],
    }).compile();

    provider = module.get<ResetPassword>(ResetPassword);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
