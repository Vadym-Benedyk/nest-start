import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '@/src/users/user.service';
import { UserInterfaces } from '@/src/users/interfaces/user.interfaces';
import {
  PayloadUserInterface,
  RefreshPayloadUserInterface,
} from '../refresh/interfaces/refresh.interfaces';
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

  async accessResponse(user: UserInterfaces): Promise<PayloadUserInterface> {
    try {
      const access = await this.token.generateAccessToken(user);

      return {
        user: user,
        payload: {
          type: 'bearer',
          token: access,
        },
      };
    } catch (error) {
      throw new Error('Failed to generate tokens. Error: ' + error);
    }
  }

  // Register a new users and return tokens
  async registerUser(
    createUserDto: CreateUserDto,
  ): Promise<RefreshPayloadUserInterface> {
    // Check if users already exists
    const userExist = await this.user.getUserByEmail(createUserDto.email);
    if (userExist) {
      console.log(createUserDto);
      throw new UnauthorizedException('User already exists');
    }
    // Create users and hash password in database
    const user = await this.user.createUser(createUserDto);
    if (!user) {
      throw new Error('Failed to register users');
    }
    const payloadUser = await this.accessResponse(user);
    const refresh = await this.token.generateRefreshToken(user);
    return {
      payload: payloadUser,
      refreshToken: refresh,
    };
  }

  // Login
  async loginUser(
    loginUserDto: LoginUserDto,
  ): Promise<RefreshPayloadUserInterface> {
    const user = await this.user.getUserByEmail(loginUserDto.email);
    if (!user) {
      throw new UnauthorizedException('Login not found');
    }

    const passwordMatch = await this.user.validatePassword(
      user.id,
      loginUserDto.password,
    );

    if (!passwordMatch) {
      throw new UnauthorizedException('Incorrect password');
    }

    const expTokenRange: number =
      Date.now() +
      parseInt(process.env.JWT_REFRESH_EXPIRATION_RANGE, 10) *
        24 *
        60 *
        60 *
        1000;

    const payloadUser = await this.accessResponse(user);

    const tokenInDatabase = await this.token.getRefreshByUserId(user.id);

    if (!tokenInDatabase) {
      // Gen a new refresh if not found
      const refresh = await this.token.generateRefreshToken(user);
      return {
        payload: payloadUser,
        refreshToken: refresh,
      };
    }

    const expirationDbRefresh = new Date(tokenInDatabase.expires).getTime();

    if (expirationDbRefresh < expTokenRange) {
      // Gen new refresh if almost expired
      const refresh = await this.token.generateRefreshToken(user);
      return {
        payload: payloadUser,
        refreshToken: refresh,
      };
    }
    // Back refresh if valid
    return {
      payload: payloadUser,
      refreshToken: tokenInDatabase.refreshToken,
    };
  }

  //refresh token
  async refreshValidate(
    refreshToken: string,
  ): Promise<RefreshPayloadUserInterface> {
    const decodedToken = this.token.decodeRefreshToken(refreshToken);

    if (!decodedToken.userId || !decodedToken.iat || !decodedToken.exp) {
      throw new UnauthorizedException('Refresh token is invalid');
    }
    const user = await this.user.getUserById(decodedToken.userId);
    if (!user) {
      throw new UnauthorizedException('User in refresh token not found');
    }
    //check token in db
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

    const accessPayload: PayloadUserInterface = await this.accessResponse(user);

    //If expiration date leas then 3 days remaining let's generate both tokens, else gen access token only
    if (decodedTokenExpiration < expTokenRange) {
      const refresh = await this.token.generateRefreshToken(user);
      return {
        payload: accessPayload,
        refreshToken: refresh,
      };
    } else {
      return {
        payload: accessPayload,
        refreshToken: databaseToken.refreshToken,
      };
    }
  }
}
