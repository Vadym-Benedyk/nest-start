import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import * as twilio from 'twilio';
import * as process from 'node:process';
import { SmsDto } from '@/src/sms/dto/smsDto';
import { PersonalInfoService } from '@/src/personal-info/personal-info.service';
import { PhoneDto } from '@/src/sms/dto/phone.dto';
import { VerifyPhoneDto } from '@/src/sms/dto/verifyPhone.dto';
import { VerifyAskInterface, VerifyOtpInterface } from '@/src/sms/interfaces/verify.interface';


@Injectable()
export class SmsService {
  private readonly client;
  private readonly verifyServiceSid: string;

  constructor(
    private readonly personalInfoService: PersonalInfoService
  ) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    this.verifyServiceSid = process.env.SERVICE_SID;
    this.client = twilio(accountSid, authToken);
  }

  async sendSms(smsDto: SmsDto): Promise<any> {
    const message = await this.client.messages.create({
      body: smsDto.body,
      from: smsDto.from,
      to: smsDto.to,
    });
    return { message };
  }

  async smsHistory(userId: string): Promise<any> {
    const user = await this.personalInfoService.getUserInfo(userId);
    if (!user) {
      throw new NotFoundException('No user info in database');
    }
    const messages = await this.client.messages.list({
      // to: user.phone
    });

    if (messages.length === 0) {
      throw new NotFoundException('No messages found');
    }

    messages.forEach((m) => console.log(m.body));
  }

  async createVerification(phoneDto: PhoneDto): Promise<VerifyAskInterface> {
    try {
      const verification = await this.client.verify.v2
        .services(this.verifyServiceSid)
        .verifications.create({
          channel: "sms",
          to: phoneDto.phone,
        });

      return {
        status: verification.status,
        message: 'OTP sent successfully',
      }
    } catch (error) {
      throw new BadRequestException('Failed to send OTP: ' + error);
    }

  }


  async createVerificationCheck(verifyPhoneDto: VerifyPhoneDto): Promise<VerifyOtpInterface> {
    try {
      const verificationCheck = await this.client.verify.v2
        .services(this.verifyServiceSid)
        .verificationChecks.create({
          code:verifyPhoneDto.verifyCode,
          to: verifyPhoneDto.phone,
        });

      if (verificationCheck.status === 'approved') {
        return {
          status: HttpStatus.OK,
          message: 'OTP verification successful',
        };
      } else {
        return {
          status: HttpStatus.BAD_REQUEST,
          message: 'Invalid OTP or verification failed',
        };
      }
    } catch (error) {
      throw new BadRequestException('Failed to verify OTP: ' + error);
    }
  }
}