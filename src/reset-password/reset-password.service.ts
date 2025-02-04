import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ResetTokenModel } from '@/src/reset-password/models/reset-token.model';
import { InjectModel } from '@nestjs/sequelize';
import { UserService } from '@/src/users/user.service';
import { generateToken } from '@/src/reset-password/utils/generateToken';
import * as process from 'node:process';
import { ResetUserTokenDto } from '@/src/reset-password/dto/response/reset-user-token.dto';
import { ChangePasswordDto } from '@/src/reset-password/dto/request/change-password.dto';

@Injectable()
export class ResetPasswordService {
  private readonly logger = new Logger(ResetPasswordService.name);
  constructor(
    @InjectModel(ResetTokenModel)
    private resetTokenModel: typeof ResetTokenModel,
    private userService: UserService,
  ) {}

  async generateResetToken(
    changePasswordDto: ChangePasswordDto,
  ): Promise<ResetUserTokenDto> {
    const { email } = changePasswordDto;
    try {
      const user = await this.userService.getUserByEmail(email);
      if (!user) {
        this.logger.error(`User with email ${email} not found`);
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const resetToken = await this.resetTokenModel.findOne({
        where: { userId: user.id },
      });
      if (resetToken) {
        this.logger.log(`Found reset token for user ${email} `);
        return await this.askBlocker(resetToken);
      } else {
        const token = await generateToken();

        const expiresAt = new Date(
          Date.now() +
          parseInt(process.env.CRYPTO_TOKEN_EXPIRATION) * 60 * 60 * 1000,
        );
        return await this.resetTokenModel.create({
          userId: user.id,
          token,
          expiresAt,
        });
      }
    } catch (error) {
      throw error;
    }
  }

  private async askBlocker(resetToken: ResetTokenModel): Promise<any> {
    const timeDiff = (Date.now() - new Date(resetToken.updatedAt).getTime()) / (1000 * 60 * 60);

    if ( resetToken.resetRequestCount >= +process.env.CRYPTO_TOKEN_EXPIRATION_DAILY_RANGE && timeDiff < 24 ) {
      this.logger.warn('Too many reset requests. Try again later');
      throw new HttpException('Too many reset requests. Try again after 24 hours', HttpStatus.TOO_MANY_REQUESTS);
    }

    resetToken.resetRequestCount += 1;
    resetToken.updatedAt = new Date();
    resetToken.token = await generateToken();
    return await resetToken.save();
  }
}