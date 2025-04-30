import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { EmailResponseInterface } from '@/src/mail/interfaces/emailResponse.interface';
import { LoggerFacadeService } from '@/src/logger/logger-facade.service';



@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggerFacadeService
    ) {
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
      this.logger.log(`Email sent to ${to} with a subject: ${subject}`, MailService.name);
      this.logger.log('Change password request finished', MailService.name);
      return filteredResponse;
    } catch (error) {
      this.logger.error(`Error sending email to ${to}. Error: ${error}`, MailService.name);
      throw new Error('Email sending failed');
    }
  }
}
