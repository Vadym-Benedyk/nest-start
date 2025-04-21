import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import * as twilio from 'twilio';
import * as process from 'node:process';
import { SmsDto } from '@/src/sms/dto/smsDto';
import { PersonalInfoService } from '@/src/personal-info/personal-info.service';
import { VerifyPhoneDto } from '@/src/sms/dto/verifyPhone.dto';
import { VerifyAskInterface, VerifyOtpInterface } from '@/src/sms/interfaces/verify.interface';
import { PhoneDto } from '@/src/phone/dto/phone.dto';
import { LoggerFacadeService } from '@/src/logger/logger-facade.service';


@Injectable()
export class SmsService {
  private readonly client;
  private readonly verifyServiceSid: string;

  constructor(
    private readonly personalInfoService: PersonalInfoService,
    private readonly logger: LoggerFacadeService,
  ) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    this.verifyServiceSid = process.env.SERVICE_SID;
    this.client = twilio(accountSid, authToken);
  }

  async sendSms(smsDto: SmsDto): Promise<any> {

    const message = await this.client.messages.create({
      body: smsDto.body,
      from: process.env.TWILIO_SENDER_NUMBER,
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
    const phone = String('+' + phoneDto.phone);

    try {
      const verification = await this.client.verify.v2
        .services(this.verifyServiceSid)
        .verifications.create({
          channel: "sms",
          to: phone,
        });
      this.logger.log(`Request OTP verification to ${phone}`, SmsService.name);

      return {
        status: verification.status,
        message: 'OTP sent successfully',
      }
    } catch (error) { throw new BadRequestException('Failed to send OTP: ' + error)}

  }

  async createVerificationCheck(verifyPhoneDto: VerifyPhoneDto): Promise<VerifyOtpInterface> {
    const code = verifyPhoneDto.verifyCode;
    const phone = String('+' + verifyPhoneDto.phone);

    try {
      const verificationCheck = await this.client.verify.v2
        .services(this.verifyServiceSid)
        .verificationChecks.create({
          code: code,
          to: phone
        });

      if (verificationCheck.status === 'approved') {
        this.logger.log(`Verification approved successfully`, SmsService.name);
        return {
          status: HttpStatus.OK,
          message: 'OTP verification successful',
        };
      } else {
        this.logger.log(`Verification OTP failed`, SmsService.name);
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