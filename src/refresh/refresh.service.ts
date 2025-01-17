import { Injectable } from '@nestjs/common';
import * as process from 'node:process';
import * as jwtweb from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
import { UserInterfaces } from '../user/interfaces/user.interfaces';
import { InjectModel } from '@nestjs/sequelize';
import { RefreshToken } from './models/refresh.model';

@Injectable()
export class RefreshService {
  protected readonly jwtweb = jwtweb;

  constructor(
    @InjectModel(RefreshToken) private refreshModel: typeof RefreshToken,
    private jwtService: JwtService,
  ) {}

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

    const token: string = this.jwtweb.sign(
      { userId },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: process.env.JWT_REFRESH_EXPIRATION,
      },
    );

    if (!token) {
      throw new Error('Failed to generate refresh token');
    }
    const savedToken = this.saveRefreshToken(token);
    if (!savedToken) {
      throw new Error('Failed to save refresh token');
    }
    return token;
  }

  //Save refresh token to database
  async saveRefreshToken(token: string): Promise<boolean> {
    try {
      await this.refreshModel.create({ refreshToken: token });
      return true;
    } catch (error) {
      console.error('Failed to save refresh token:', error);
      return false;
    }
  }
}
