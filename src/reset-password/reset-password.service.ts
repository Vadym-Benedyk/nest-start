import { Injectable, Logger } from '@nestjs/common';
import { ResetTokenModel } from '@/src/reset-password/models/reset-token';
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
        return;
      }

      const resetToken = await this.resetTokenModel.findOne({
        where: { userId: user.id },
      });
      if (resetToken) {
        this.logger.log(`Reset token for user ${email} already exists`);
        await this.askBlocker(resetToken);
      } else {
        const token = await generateToken();
        const expiresAt = new Date(
          Date.now() +
            parseInt(process.env.CRYPTO_TOKEN_EXPIRATION) * 60 * 60 * 1000,
        );
        await this.resetTokenModel.create({
          userId: user.id,
          token,
          expiresAt,
        });
      }
    } catch (error) {
      this.logger.error(
        `Error during generation recover password token of ${email}`,
      );
      throw new Error('Error during generation recover password token', error);
    }
  }

  private async askBlocker(token): Promise<any> {
    const timeDiff =
      (Date.now() - new Date(token.updatedAt).getTime()) / (1000 * 60 * 60);

    if (
      token.resetRequestCount >=
      +process.env.CRYPTO_TOKEN_EXPIRATION_DAILY_RANGE &&
      timeDiff < 24
    ) {
      this.logger.warn(`Too many reset requests. Try again later`);
      throw new Error('Too many reset requests. Try again after 24 hours');
    }

    token.resetRequestCount += 1;
    token.updatedAt = new Date();
    token.token = generateToken();
    return await token.save();
  }
}