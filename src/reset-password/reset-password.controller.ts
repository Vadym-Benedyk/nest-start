import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChangePasswordDto } from '@/src/reset-password/dto/change-password.dto';
import { ResetPasswordService } from '@/src/reset-password/reset-password.service';
import { ConfirmNewPasswordDto } from '@/src/reset-password/dto/confirm-new-password.dto';
import { ResponseUpdateUserDto } from '@/src/user-role/dto/response-update-user-role.dto';
import { UpdateUserInterface } from '@/src/users/interfaces/user.interfaces';
import { EmailResponseInterface } from '@/src/mail/interfaces/emailResponse.interface';

@ApiTags('Recover Password')
@Controller('password-change')
export class ResetPasswordController {
  constructor(private readonly resetPassService: ResetPasswordService) {}

  @ApiOperation({
    summary: 'Change password',
    description: 'Change user password',
  })
  @Post('request')
  public async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<EmailResponseInterface> {
    return await this.resetPassService.generateResetToken(changePasswordDto);
  }

  @ApiOperation({
    summary: 'Accept new password and token',
    description: 'New password and token accept in body',
  })
  @ApiResponse({ type: ResponseUpdateUserDto })
  @Post('confirm')
  public async confirmNewPassword(
    @Body() confirmNewPasswordDto: ConfirmNewPasswordDto,
  ): Promise<UpdateUserInterface> {
    return await this.resetPassService.confirmNewPassword(
      confirmNewPasswordDto
    );
  }
}
