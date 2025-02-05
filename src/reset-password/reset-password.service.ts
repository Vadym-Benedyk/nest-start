import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ResetTokenModel } from '@/src/reset-password/models/reset-token.model';
import { InjectModel } from '@nestjs/sequelize';
import { UserService } from '@/src/users/user.service';
import { generateToken } from '@/src/reset-password/utils/generateToken';
import * as process from 'node:process';
import { ResetUserTokenDto } from '@/src/reset-password/dto/response/reset-user-token.dto';
import { ChangePasswordDto } from '@/src/reset-password/dto/request/change-password.dto';
import { ConfigService } from '@nestjs/config';
import { MailService } from '@/src/mail/mail.service';
import { SendEmailResponseDto } from '@/src/reset-password/dto/response/send-email-response.dto';
import { ConfirmNewPasswordDto } from '@/src/reset-password/dto/request/confirm-new-password.dto';
import { hashPassword } from '@/src/auth/utility/hashPassword';
import { UpdateUserInterface } from '@/src/users/interfaces/user.interfaces';
// import * as fs from 'fs';
// import * as path from 'path';

@Injectable()
export class ResetPasswordService {
  private readonly logger = new Logger(ResetPasswordService.name);
  constructor(
    @InjectModel(ResetTokenModel)
    private resetTokenModel: typeof ResetTokenModel,
    private userService: UserService,
    private readonly configService: ConfigService,
    private readonly emailService: MailService,
  ) {}

  async generateResetToken(changePasswordDto: ChangePasswordDto): Promise<any> {
    const { email } = changePasswordDto;

    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      this.logger.error(`User with email ${email} not found`);
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    let resetToken = await this.resetTokenModel.findOne({
      where: { userId: user.id },
    });

    if (resetToken) {
      this.checkResetRequestLimit(resetToken);
    } else {
      resetToken = this.resetTokenModel.build({
        userId: user.id,
        resetRequestCount: 0,
      });
    }

    const savedTokenObject = await this.saveOrUpdateResetToken(resetToken);

    await this.sendPasswordResetEmail(email, savedTokenObject.token);
  }

  private checkResetRequestLimit(resetToken: ResetTokenModel): void {
    const timeDiff =
      (Date.now() - new Date(resetToken.updatedAt).getTime()) /
      (1000 * 60 * 60);

    if (
      resetToken.resetRequestCount >=
        +process.env.CRYPTO_TOKEN_EXPIRATION_DAILY_RANGE &&
      timeDiff < 24
    ) {
      this.logger.warn('Too many reset requests. Try again later');
      throw new HttpException(
        'Too many reset requests. Try again after 24 hours',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  }

  private async saveOrUpdateResetToken(
    resetToken: ResetTokenModel,
  ): Promise<ResetUserTokenDto> {
    resetToken.token = await generateToken();
    resetToken.updatedAt = new Date();
    resetToken.expiresAt = new Date(
      Date.now() +
        parseInt(process.env.CRYPTO_TOKEN_EXPIRATION) * 60 * 60 * 1000,
    );
    resetToken.resetRequestCount += 1;

    return await resetToken.save();
  }

  private async sendPasswordResetEmail(
    to: string,
    token: string,
  ): Promise<SendEmailResponseDto> {
    const resetUrl = `${this.configService.get<string>('HOST')}?token=${token}`;
    const htmlContent = `
    <p>You requested a <b>password reset</b>. Click the link below:</p>
    <a href="${resetUrl}">${resetUrl}</a>
    <p>If you did not request this, please ignore this email.</p>
  `;

    // const templatePath = path.join(__dirname, '..', 'static', 'mail', 'templates', 'reset-password-template.html');
    // let htmlContent = fs.readFileSync(templatePath, 'utf8');

    return this.emailService.sendEmail(
      to,
      'Password Reset from Poster.fiveDev.com',
      htmlContent,
    );
  }

  async confirmNewPassword(
    confirmNewPasswordDto: ConfirmNewPasswordDto,
  ): Promise<UpdateUserInterface> {
    const { password, resetToken } = confirmNewPasswordDto;
    const hashedPassword = await hashPassword(password);
    this.logger.log('hashed received password');
    const findToken = await this.resetTokenModel.findOne({
      where: { token: resetToken },
    });
    // this.logger.log('Token info executed', tokenInfo);

    if (!findToken) {
      this.logger.error('Invalid token');
      throw new HttpException(
        'There is not request token in database',
        HttpStatus.BAD_REQUEST,
      );
    }

    const { expiresAt, userId } = findToken;
    this.logger.log('Valid token executed');

    if (expiresAt && expiresAt < new Date(Date.now())) {
      this.logger.error('Reset token expired');
      throw new HttpException(
        'Reset password token is expired',
        HttpStatus.GATEWAY_TIMEOUT,
      );
    }

    return this.userService.updateUser({
      id: userId,
      password: hashedPassword,
    });
  }
}
