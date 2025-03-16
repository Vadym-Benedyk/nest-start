import { Test, TestingModule } from '@nestjs/testing';
import { Sms } from './sms';

describe('Sms', () => {
  let provider: Sms;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Sms],
    }).compile();

    provider = module.get<Sms>(Sms);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
