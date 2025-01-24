import { Injectable } from '@nestjs/common';
import * as process from 'node:process';
import * as jwt from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
import { UserInterfaces } from '../user/interfaces/user.interfaces';
import { InjectModel } from '@nestjs/sequelize';
import { RefreshToken } from './models/refresh.model';
import { RefreshTokenInterface } from './interfaces/refresh.interfaces';

@Injectable()
export class RefreshService {
  protected readonly jwtweb = jwt;

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
      throw new Error('Failed to generate access token. Error: ' + error);
    }
  }

  async generateRefreshToken(user: UserInterfaces): Promise<string> {
    const expirationTime =
      parseInt(process.env.JWT_REFRESH_EXPIRATION) * 24 * 60 * 60;
    const token: string = this.jwtweb.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: expirationTime,
      },
    );
    if (!token) {
      throw new Error('Failed to generate refresh token');
    }
    const isSavedToken = await this.saveRefreshToken(user.id, token);

    if (isSavedToken) {
      return token;
    }
  }

  // Save refresh token to database
  async saveRefreshToken(userId: string, token: string): Promise<boolean> {
    const expires = new Date(
      Date.now() +
        parseInt(process.env.JWT_REFRESH_EXPIRATION) * 24 * 60 * 60 * 1000,
    );

    try {
      await this.refreshModel.create({
        userId: userId,
        refreshToken: token,
        expires: expires,
      });
      return true;
    } catch (error) {
      console.error('Failed to save refresh token:', error);
      return false;
    }
  }

  //Decode refresh token
  public decodeRefreshToken(token: string): any {
    try {
      return this.jwtweb.decode(token);
    } catch (error) {
      console.error('Failed to decode refresh token:', error);
    }
  }
  //delete refresh tokens.Return number of deleted tokens
  async deleteRefreshToken(userId: string) {
    try {
      return await this.refreshModel.destroy({
        where: {
          userId: userId,
        },
      });
    } catch (error) {
      throw new Error('Failed to delete refresh token. Error: ' + error);
    }
  }
  // Get refresh token from DB
  async getDBToken(token: string): Promise<RefreshTokenInterface> {
    try {
      return await this.refreshModel.findOne({
        where: { refreshToken: token },
      });
    } catch (error) {
      throw new Error('Failed to read refresh token from DB. Error: ' + error);
    }
  }
}
