import { Injectable } from '@nestjs/common';
import * as process from 'node:process';
import * as jwtweb from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
import { UserInterfaces } from '../user/interfaces/user.interfaces';

@Injectable()
export class RefreshService {
  protected readonly jwtweb = jwtweb;

  constructor(private jwtService: JwtService) {}

  async generateAccessToken(user: UserInterfaces): Promise<string> {
    const payload = {
      userId: user.id,
      role: user.role,
    };
    try {
      return await this.jwtService.signAsync(payload);
    } catch (error) {
      throw new Error('Failed to generate access token. Error:', error);
    }
  }

  generateRefreshToken(userId: string): string {
    if (
      !process.env.JWT_REFRESH_SECRET ||
      !process.env.JWT_REFRESH_EXPIRATION
    ) {
      throw new Error(
        'JWT_REFRESH_SECRET or JWT_REFRESH_EXPIRATION is not set in the environment variables',
      );
    }

    return this.jwtweb.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRATION,
    });
  }
}
