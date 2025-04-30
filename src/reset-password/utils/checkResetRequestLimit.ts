import { HttpException, HttpStatus, LoggerService } from '@nestjs/common';
import { ResetTokenModel } from '@/src/reset-password/models/reset-token.model';

/**
 * Перевіряє обмеження на кількість запитів на скидання паролю
 */

export function checkResetRequestLimit(
  resetToken: ResetTokenModel,
  logger: LoggerService,
  context = 'ResetPasswordService',
  maxRequests = Number(process.env.CRYPTO_TOKEN_EXPIRATION_DAILY_RANGE),
): void {
  const hoursSinceUpdate =
    (Date.now() - new Date(resetToken.updatedAt).getTime()) / (1000 * 60 * 60);

  if (resetToken.resetRequestCount >= maxRequests && hoursSinceUpdate < 24) {
    logger.warn('Too many reset requests. Try again later', context);
    throw new HttpException(
      'Too many reset requests. Try again after 24 hours',
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}