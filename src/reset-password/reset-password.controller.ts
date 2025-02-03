import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChangePasswordDto } from '@/src/reset-password/dto/request/change-password.dto';
import { ResetPasswordService } from '@/src/reset-password/reset-password.service';

@ApiTags('Recover Password')
@Controller('password-change')
export class ResetPasswordController {
  constructor(private readonly resetPassService: ResetPasswordService) {}

  @ApiOperation({
    summary: 'Change password',
    description: 'Change user password',
  })
  // @ApiResponse({ type: any })
  @Post('request')
  public async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<any> {
    return await this.resetPassService.generateResetToken(changePasswordDto);
  }

  // @ApiOperation({
  //   summary: 'Accept new password and token',
  //   description: 'Accept new password and token',
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
