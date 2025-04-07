import { Injectable } from '@nestjs/common';
import * as process from 'node:process';
import * as jwt from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { RefreshToken } from './models/refresh.model';
import { RefreshTokenInterface } from './interfaces/refresh.interfaces';
import { LoggerFacadeService } from '@/src/logger/logger-facade.service';
import { UpdateUserDto } from '@/src/users/dto/update-user.dto';



@Injectable()
export class RefreshService {
  protected readonly jwtweb = jwt;

  constructor(
    @InjectModel(RefreshToken) private refreshModel: typeof RefreshToken,
    private jwtService: JwtService,
    private readonly logger: LoggerFacadeService,
  ) {}

  async generateAccessToken(user: UpdateUserDto): Promise<string> {
    const payload = {
      userId: user.id,
    };
    try {
      return await this.jwtService.signAsync(payload);
    } catch (error) {
      throw new Error('Failed to generate access token. Error: ' + error);
    }
  }

  async generateRefreshToken(user: UpdateUserDto): Promise<string> {
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

  //check validation refresh token and nearby expiration date
  async checkGenerateRefreshToken(user: UpdateUserDto): Promise<any> {
    const expTokenRange =
      Date.now() +
      parseInt(process.env.JWT_REFRESH_EXPIRATION_RANGE, 10) *
        24 *
        60 *
        60 *
        1000;

    const tokenInDatabase = await this.getRefreshByUserId(user.id);
    if (!tokenInDatabase) {
      return await this.generateRefreshToken(user);
    }

    const expirationDbRefresh = new Date(tokenInDatabase.expires).getTime();

    if (expirationDbRefresh < expTokenRange) {
      return await this.generateRefreshToken(user);
    } else {
      return tokenInDatabase.refreshToken;
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
  async deleteRefreshToken(userId: string): Promise<number> {
    try {
      return await this.refreshModel.destroy({
        where: {
          userId: userId,
        },
      });
    } catch (error) {
      this.logger.error('Failed to delete refresh token, token not found', RefreshService.name);
      throw new Error('Failed to delete refresh token. Error: ' + error);
    }
  }

  // Get refresh token by token from DB
  async getDBToken(token: string): Promise<RefreshTokenInterface> {
    try {
      return await this.refreshModel.findOne({
        where: { refreshToken: token },
      });
    } catch (error) {
      throw new Error('Failed to read refresh token from DB. Error: ' + error);
    }
  }

  //Get db token from refresh_token by users.id
  async getRefreshByUserId(userId: string): Promise<RefreshTokenInterface> {
    try {
      return await this.refreshModel.findOne({
        where: { userId: userId },
      });
    } catch (error) {
      throw new Error('Failed to read refresh token from DB. Error: ' + error);
    }
  }
}
