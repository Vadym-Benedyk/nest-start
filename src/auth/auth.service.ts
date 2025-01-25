import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { Response } from 'express';
import * as bcrypt from 'bcryptjs';
import { UserDto } from '../user/dto/user.dto';
import { UserInterfaces } from '../user/interfaces/user.interfaces';
import { AuthenticationPayloadInterface } from '../refresh/interfaces/refresh.interfaces';
import { RefreshService } from '../refresh/refresh.service';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import * as process from 'node:process';

@Injectable()
export class AuthService {
  constructor(
    private readonly user: UserService,
    private readonly token: RefreshService,
  ) {}

  // Hash the password
  public hashPassword(password: string): string {
    const hashedPassword = bcrypt.hashSync(password, 10);
    if (!hashedPassword) {
      throw new Error('Failed to hash password');
    }
    return hashedPassword;
  }

  //change password
  async updateUserPassword(userDto: UserDto): Promise<UserInterfaces> {
    const hashedPassword = this.hashPassword(userDto.password);
    return await this.user.createUser({
      ...userDto,
      password: hashedPassword,
    });
  }

  // Build authentication response payload
  public buildResponsePayload(
    user: UserInterfaces,
    access: string,
    // refresh?: string,
  ): AuthenticationPayloadInterface {
    return {
      user: user,
      payload: {
        type: 'bearer',
        token: access,
      },
    };
  }

  async composeGenerateTokens(
    user: UserInterfaces,
    res: Response,
  ): Promise<AuthenticationPayloadInterface> {
    try {
      const access = await this.token.generateAccessToken(user);
      const refresh = await this.token.generateRefreshToken(user);

      res.cookie('refreshToken', refresh, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge:
          parseInt(process.env.JWT_REFRESH_EXPIRATION) * 24 * 60 * 60 * 1000,
      });

      return this.buildResponsePayload(user, access);
    } catch (error) {
      throw new Error('Failed to generate tokens. Error: ' + error);
    }
  }

  // Register a new user and return tokens
  async registerUser(
    createUserDto: CreateUserDto,
    res: Response,
  ): Promise<AuthenticationPayloadInterface> {
    // Check if user already exists
    const userExist = await this.user.getUserByEmail(createUserDto.email);
    if (userExist) {
      throw new UnauthorizedException('User already exists');
    }
    // Create user and hash password in database
    const user = await this.updateUserPassword(createUserDto);
    if (!user) {
      throw new Error('Failed to register user');
    }

    return this.composeGenerateTokens(user, res);
  }

  // Login
  async loginUser(
    loginUserDto: LoginUserDto,
    res: Response,
  ): Promise<AuthenticationPayloadInterface> {
    const user = await this.user.getUserByEmail(loginUserDto.email);
    if (!user) {
      throw new UnauthorizedException('login not found');
    }
    const isValid = await bcrypt.compare(loginUserDto.password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Wrong password');
    }

    return this.composeGenerateTokens(user, res);
  }

  //refresh token
  async refreshValidate(refreshToken: string, res: Response): Promise<any> {
    const decodedToken = this.token.decodeRefreshToken(refreshToken);

    if (!decodedToken.userId || !decodedToken.iat || !decodedToken.exp) {
      throw new UnauthorizedException('Refresh token is invalid');
    }
    const user = await this.user.getUserById(decodedToken.userId);
    if (!user) {
      await this.token.deleteRefreshToken(user.id);
      throw new UnauthorizedException('User in refresh token not found');
    }

    const databaseToken = await this.token.getDBToken(refreshToken);
    if (!databaseToken) {
      await this.token.deleteRefreshToken(user.id);
      throw new UnauthorizedException('Refresh token has not register in DB');
    }

    const databaseTokenExpiration = new Date(databaseToken.expires).getTime();
    const decodedTokenExpiration = new Date(decodedToken.exp * 1000).getTime();

    if (
      decodedTokenExpiration < Date.now() ||
      databaseTokenExpiration < Date.now()
    ) {
      await this.token.deleteRefreshToken(user.id);
      throw new UnauthorizedException('Refresh token is expired');
    }

    const expTokenRange: number =
      Date.now() +
      parseInt(process.env.JWT_REFRESH_EXPIRATION_RANGE) * 24 * 60 * 60 * 1000;

    //If expiration date leas then 3 days remaining let's generate both tokens, else gen access token only
    if (decodedTokenExpiration < expTokenRange) {
      return this.composeGenerateTokens(user, res);
    } else {
      const access: string = await this.token.generateAccessToken(user);
      return this.buildResponsePayload(user, access);
    }
  }
}
