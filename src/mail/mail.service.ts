import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import chalk from 'chalk';
import { EmailResponseInterface } from '@/src/mail/interfaces/emailResponse.interface';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  linkChalk = chalk.underline.magenta;
  subjectChalk = chalk.bgGreen;

  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('smtp.host'),
      port: this.configService.get<number>('smtp.port'),
      secure: false,
      auth: {
        user: this.configService.get<string>('smtp.user'),
        pass: this.configService.get<string>('smtp.pass'),
      },
    });
  }

  async sendEmail(to: string, subject: string, htmlContent: string): Promise<EmailResponseInterface> {

    const mailOptions = {
      from: this.configService.get<string>('smtp.from'),
      to,
      subject,
      html: htmlContent,
    };

    try {
      const { ehlo, ...filteredResponse } = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent to ${this.linkChalk(to)} with a subject: ${this.subjectChalk(subject)}`);
      return filteredResponse;
    } catch (error) {
      this.logger.error(`Error sending email to ${to}: ${error}`);
      throw new Error('Email sending failed');
    }
  }
}
