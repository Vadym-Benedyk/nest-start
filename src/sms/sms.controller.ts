import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SmsService } from '@/src/sms/sms.service';
import { SmsDto } from '@/src/sms/dto/smsDto';


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
    summary: 'Get verify OTP',
    description: 'Get verify sms for OTP'
  })
  @ApiResponse({})
  @Get('otp')
  async createVerification() {
    return await this.smsService.createVerification()
  }

}
