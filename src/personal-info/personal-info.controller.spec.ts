import { Test, TestingModule } from '@nestjs/testing';
import { PersonalInfoController } from './personal-info.controller';
import { PersonalInfoService } from './personal-info.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@/src/users/user.service';
import { JwtAuthGuard } from '@/src/auth/guards/JwtAuthGuard';

describe('PersonalInfoController', () => {
  let controller: PersonalInfoController;

  const mockPersonalInfoService = {
    getInfo: jest.fn(),
    updateInfo: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mocked-token'),
  };

  const mockUserService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PersonalInfoController],
      providers: [
        { provide: PersonalInfoService, useValue: mockPersonalInfoService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: UserService, useValue: mockUserService },
      ],
    })
      .overrideGuard(JwtAuthGuard) // Замінюємо реальний гард на мок
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();

    controller = module.get<PersonalInfoController>(PersonalInfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});