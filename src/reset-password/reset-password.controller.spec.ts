import { Test, TestingModule } from '@nestjs/testing';
import { ResetPasswordController } from './reset-password.controller';
import { ResetPasswordService } from '@/src/reset-password/reset-password.service';
import { ChangePasswordDto } from '@/src/reset-password/dto/change-password.dto';
import { ConfirmNewPasswordDto } from '@/src/reset-password/dto/confirm-new-password.dto';
import { EmailResponseInterface } from '@/src/mail/interfaces/emailResponse.interface';
import { UpdateUserInterface } from '@/src/users/interfaces/user.interfaces';

describe('ResetPasswordController', () => {
  let controller: ResetPasswordController;
  let resetPasswordService: ResetPasswordService;

  const mockResetPasswordService = {
    generateResetToken: jest.fn((dto: ChangePasswordDto) => ({
      success: true,
      message: 'Reset token sent',
    })),
    confirmNewPassword: jest.fn((dto: ConfirmNewPasswordDto) => ({
      id: '1',
      email: 'test@example.com',
      role: 'user',
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResetPasswordController],
      providers: [{ provide: ResetPasswordService, useValue: mockResetPasswordService }],
    }).compile();

    controller = module.get<ResetPasswordController>(ResetPasswordController);
    resetPasswordService = module.get<ResetPasswordService>(ResetPasswordService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('changePassword', () => {
    it('should request a password change and return success message', async () => {
      const dto: ChangePasswordDto = { email: 'test@example.com' };
      const result: EmailResponseInterface = await controller.changePassword(dto);

      expect(result).toEqual({
        success: true,
        message: 'Reset token sent',
      });

      expect(resetPasswordService.generateResetToken).toHaveBeenCalledWith(dto);
    });
  });

  describe('confirmNewPassword', () => {
    it('should confirm new password and return updated user', async () => {
      const dto: ConfirmNewPasswordDto = {
        resetToken: 'valid-token',
        password: 'newSecurePassword123',
      };

      const result: UpdateUserInterface = await controller.confirmNewPassword(dto);

      expect(result).toEqual({
        id: '1',
        email: 'test@example.com',
        role: 'user',
      });

      expect(resetPasswordService.confirmNewPassword).toHaveBeenCalledWith(dto);
    });
  });
});