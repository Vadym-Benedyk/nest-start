import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';
import { Logger } from '@nestjs/common';
import { ResetPasswordService } from '@/src/reset-password/reset-password.service';

export const generateToken = async () => {
  const logger = new Logger(ResetPasswordService.name);
  try {
    const token = crypto.randomBytes(32).toString('hex');
    const hashedToken = await bcrypt.hash(token, 10);
    logger.log(`Token generated and hashed, ${hashedToken}`);
    return hashedToken;
  } catch (error) {
    logger.error(`Error during generation recover password token. Error: ${error}`);
    throw error;
  }
};