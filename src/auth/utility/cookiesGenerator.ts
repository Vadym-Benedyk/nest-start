import { Response } from 'express';

export const cookiesGenerator = (res: Response, refreshToken: string) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: parseInt(process.env.JWT_REFRESH_EXPIRATION) * 24 * 60 * 60 * 1000,
  });
};

// Simple func for accept refresh token and set cookie
