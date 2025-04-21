import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ResetTokenModel } from '@/src/reset-password/models/reset-token.model';
import { InjectModel } from '@nestjs/sequelize';
import { UserService } from '@/src/users/user.service';
import { generateToken } from '@/src/reset-password/utils/generateToken';
import * as process from 'node:process';
import { ResetUserTokenDto } from '@/src/reset-password/dto/reset-user-token.dto';
import { ChangePasswordDto } from '@/src/reset-password/dto/change-password.dto';
import { ConfigService } from '@nestjs/config';
import { MailService } from '@/src/mail/mail.service';
import { ConfirmNewPasswordDto } from '@/src/reset-password/dto/confirm-new-password.dto';
import { hashPassword } from '@/src/auth/utility/hashPassword';
import { UpdateUserInterface } from '@/src/users/interfaces/user.interfaces';
import * as fs from 'fs';
import * as path from 'path';
import { EmailResponseInterface } from '@/src/mail/interfaces/emailResponse.interface';
import { LoggerFacadeService } from '@/src/logger/logger-facade.service';
import { checkResetRequestLimit } from '@/src/reset-password/utils/checkResetRequestLimit';




@Injectable()
export class ResetPasswordService {
  constructor(
    @InjectModel(ResetTokenModel)
    private resetTokenModel: typeof ResetTokenModel,
    private userService: UserService,
    private readonly configService: ConfigService,
    private readonly emailService: MailService,
    private readonly logger: LoggerFacadeService,
  ) {}

  async generateResetToken( changePasswordDto: ChangePasswordDto ): Promise<EmailResponseInterface> {
    const { email } = changePasswordDto;
    this.logger.log("Change password request started", ResetPasswordService.name);

    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      this.logger.error(`User with email ${email} not found`, ResetPasswordService.name);
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    let resetToken = await this.resetTokenModel.findOne({ where: { userId: user.id } });

    if (resetToken) {
      checkResetRequestLimit(resetToken, this.logger, ResetPasswordService.name);
    } else {
      resetToken = this.resetTokenModel.build({ userId: user.id, resetRequestCount: 0 });
    }

    const savedToken = await this.saveOrUpdateResetToken(resetToken);

    return await this.sendPasswordResetEmail(email, savedToken.token);
  }


  private async saveOrUpdateResetToken( resetToken: ResetTokenModel ): Promise<ResetUserTokenDto> {
    resetToken.token = await generateToken();

    resetToken.updatedAt = new Date();

    resetToken.expiresAt = new Date(
      Date.now() +
        parseInt(process.env.CRYPTO_TOKEN_EXPIRATION) * 60 * 60 * 1000,
    );

    resetToken.resetRequestCount += 1;

    try {
     const savedToken = await resetToken.save();
     this.logger.log(`Reset token:  ${savedToken.token} saved to db`, ResetPasswordService.name);
     return savedToken.dataValues;

    } catch (error) {
      this.logger.error(`Error saving reset token. Error: ${error}`, ResetPasswordService.name);
    }
  }


  private async sendPasswordResetEmail( to: string, token: string ): Promise<EmailResponseInterface> {
    const resetUrl = `${this.configService.get<string>('FRONTEND_RESET_PASSWORD_URL')}?token=${token}`;

    const templatePath = path.resolve(
      'static',
      'mail',
      'templates',
      'reset-password-template.html',
    );
    let htmlContent = fs.readFileSync(templatePath, 'utf8');
    htmlContent = htmlContent.replace(/{{RESET_URL}}/g, resetUrl);

    return this.emailService.sendEmail(
      to,
      'Password Reset from Poster.fiveDev.com',
      htmlContent,
    );
  }


  async confirmNewPassword(confirmNewPasswordDto: ConfirmNewPasswordDto ): Promise<UpdateUserInterface> {
    const { password, resetToken } = confirmNewPasswordDto;
    const hashedPassword = await hashPassword(password);
    this.logger.log('Accept change password started', ResetPasswordService.name);
    const findToken = await this.resetTokenModel.findOne({
      where: { token: resetToken },
    });

    if (!findToken) {
      this.logger.error('Invalid token', ResetPasswordService.name);
      throw new HttpException(
        'There is not request token in database',
        HttpStatus.BAD_REQUEST,
      );
    }

    const { expiresAt, userId } = findToken;

    if (expiresAt && expiresAt < new Date(Date.now())) {
      this.logger.error('Reset token expired', ResetPasswordService.name);
      throw new HttpException(
        'Reset password token is expired',
        HttpStatus.GATEWAY_TIMEOUT,
      );
    }

    try {
      await this.resetTokenModel.destroy({ where: { token: resetToken } });
    } catch (error) {
      this.logger.error(`Error deleting reset token. Error: ${error}`, ResetPasswordService.name);
    }

    return this.userService.updateUserPassword({
      id: userId,
      password: hashedPassword,
    });
  }
}
