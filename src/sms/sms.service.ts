import { Injectable, NotFoundException } from '@nestjs/common';
import * as twilio from 'twilio';
import * as process from 'node:process';
import { SmsDto } from '@/src/sms/dto/smsDto';
import { PersonalInfoService } from '@/src/personal-info/personal-info.service';

@Injectable()
export class SmsService {
  private readonly client;

  constructor(
    private readonly personalInfoService: PersonalInfoService
  ) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
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

  async createVerification() {
    const verification = await this.client.verify.v2
      .services("VAaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")
      .verifications.create({
        channel: "sms",
        to: process.env.TWILIO_PHONE_NUMBER,
      });

    console.log(verification.status);
  }
}