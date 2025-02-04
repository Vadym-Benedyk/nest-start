import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ChangePasswordDto } from '@/src/reset-password/dto/request/change-password.dto';
import { ResetPasswordService } from '@/src/reset-password/reset-password.service';
import { SendEmailResponseDto } from '@/src/reset-password/dto/response/send-email-response.dto';
// import { ConfirmNewPasswordDto } from '@/src/reset-password/dto/request/confirm-new-password.dto';

@ApiTags('Recover Password')
@Controller('password-change')
export class ResetPasswordController {
  constructor(private readonly resetPassService: ResetPasswordService) {}

  @ApiOperation({
    summary: 'Change password',
    description: 'Change user password',
  })
  @ApiResponse({ type: SendEmailResponseDto })
  @Post('request')
  public async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<any> {
    return await this.resetPassService.generateResetToken(changePasswordDto);
  }

  // @ApiOperation({
  //   summary: 'Accept new password and token',
  //   description: 'New password and token accept in body',
  // })
  // @ApiResponse({ type: any })
  // @Post('confirm')
  // public async confirmNewPassword(
  //   @Body() confirmNewPasswordDto: ConfirmNewPasswordDto,
  // ): Promise<any> {
  //   return await this.resetPassService.confirmNewPassword(
  //     confirmNewPasswordDto,
  //   );
  // }
}
