import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
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

  async sendEmail(to: string, subject: string, htmlContent: string) {

    const mailOptions = {
      from: this.configService.get<string>('smtp.from'),
      to,
      subject,
      html: htmlContent,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent to ${to} with subject: ${subject}`);
      return info;
    } catch (error) {
      this.logger.error(`Error sending email to ${to}: ${error}`);
      throw new Error('Email sending failed');
    }
  }



  // async sendPasswordResetEmail(to: string, token: string) {
  //   const resetUrl = `${this.configService.get<string>('HOST')}/password-change/confirm?token=${token}`;
  //
  //   const mailOptions = {
  //     from: this.configService.get<string>('smtp.from'),
  //     to,
  //     subject: 'Password Reset Request from Poster',
  //     html: `
  //       <p>You requested a password reset. Click the link below:</p>
  //       <a href="${resetUrl}">${resetUrl}</a>
  //       <p>If you did not request this, please ignore this email.</p>
  //     `,
  //   };
  //
  //   try {
  //     const info = await this.transporter.sendMail(mailOptions);
  //     this.logger.log(`Password reset email sent to ${to}`);
  //     return info;
  //   } catch (error) {
  //     this.logger.error(`Error sending email to ${to}: ${error}`);
  //     throw new Error('Email sending failed');
  //   }
  // }
}
