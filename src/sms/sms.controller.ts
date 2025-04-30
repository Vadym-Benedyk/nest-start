import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SmsService } from '@/src/sms/sms.service';
import { SmsDto} from '@/src/sms/dto/smsDto';
import { VerifyPhoneDto } from '@/src/sms/dto/verifyPhone.dto';
import { VerifyAskInterface, VerifyOtpInterface } from '@/src/sms/interfaces/verify.interface';
import { PhoneDto } from '@/src/phone/dto/phone.dto';
import { Permissions } from '@/src/auth/decorators/get-permission.decorator';
import { JwtAuthGuard } from '@/src/auth/guards/JwtAuthGuard';
import { PermissionsGuard } from '@/src/auth/guards/PermissionsGuard';


@ApiBearerAuth()
@Permissions('otp-service')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) {
  }

  @ApiOperation({
    summary: 'Send default SMS to user',
    description: 'Send SMS to user'
  })
  @ApiResponse({
    status: 200,
    description: 'SMS sent successfully'
  })
  @Post('send')
  async sendSms(@Body() smsDto: SmsDto): Promise<any> {
    return await this.smsService.sendSms(smsDto);
  }


  @ApiOperation({
    summary: 'User message history',
    description: 'User message history'
  })
  @ApiResponse({ status: 200 })
  @Get('history/:userId')
  async smsHistory(@Param('userId') userId: string): Promise<any> {
    return await this.smsService.smsHistory(userId);
  }


  @ApiOperation({
    summary: 'Ask OTP',
    description: 'Get verify by phone number'
  })
  @ApiResponse({ status: 200 })
  @Post('otp')
  async createVerification(@Body() phoneDto: PhoneDto): Promise<VerifyAskInterface> {
    return await this.smsService.createVerification(phoneDto)
  }


  @ApiOperation({
    summary: 'Verify OTP',
    description: 'Return phone number and verification sms code'
  })
  @Post('verify')
  async verifyOtp(@Body() verifyPhoneDto: VerifyPhoneDto): Promise<VerifyOtpInterface> {
    return await this.smsService.createVerificationCheck( verifyPhoneDto );
  }

}
