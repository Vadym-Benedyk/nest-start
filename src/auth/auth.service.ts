import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UserService } from '@/src/users/user.service';
import { PayloadUserInterface, RefreshPayloadUserInterface } from '../refresh/interfaces/refresh.interfaces';
import { RefreshService } from '../refresh/refresh.service';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import * as process from 'node:process';
import { UserRoleService } from '@/src/user-role/user-role.service';
import { RefreshStatusInterface } from '@/src/auth/interfaces/createUser.interface';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';



@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly user: UserService,
    private readonly token: RefreshService,
    private readonly userRole: UserRoleService,
    private readonly configService: ConfigService
  ) {}

  async accessResponse(user: CreateUserDto): Promise<PayloadUserInterface> {
    try {
      const access: string = await this.token.generateAccessToken(user);

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
  async registerUser(createUserDto: CreateUserDto): Promise<RefreshPayloadUserInterface> {
    // Check if users already exists
    const userExist = await this.user.getUserByEmail(createUserDto.email);
    if (userExist) {
      throw new UnauthorizedException('User already exists');
    }
    // Create users and hash password in database
    const user = await this.user.createUser(createUserDto);
    if (!user) {
      throw new Error('Failed to register users');
    }
    //return user obj and payload(access_token)
    const payloadUser = await this.accessResponse(user);
    const refresh = await this.token.generateRefreshToken(user);
    // Add default role to user when register
    const addRole = await this.userRole.addDefaultRoleToUser(user.id);
    if (payloadUser && refresh && addRole) {
      this.logger.log('User was successfully registered in DB');
      return {
        payload: payloadUser,
        refreshToken: refresh,
      };
    }
  }

  // Login
  async loginUser(
    loginUserDto: LoginUserDto,
  ): Promise<RefreshPayloadUserInterface> {
    //Get user from email
    const user = await this.user.getUserByEmail(loginUserDto.email);
    if (!user) {
      throw new UnauthorizedException('Login not found');
    }
    //Check coincidence password
    const passwordMatch = await this.user.validatePassword(
      user.id,
      loginUserDto.password,
    );

    if (!passwordMatch) {
      throw new UnauthorizedException('Incorrect password');
    }

    const payloadUser = await this.accessResponse(user);
    const refreshToken = await this.token.checkGenerateRefreshToken(user);

    return {
      payload: payloadUser,
      refreshToken: refreshToken,
    };
  }


  async logoutUser(userId: string): Promise<RefreshStatusInterface> {
    const deletedTokens = await this.token.deleteRefreshToken(userId);
    if (deletedTokens) {
      this.logger.log('Logout successful');
      return {
        status: 200,
        message: 'Logout successful',
      };
    } else {
      this.logger.log('Logout get started but refresh token not found')
      return {
        status: 500,
        message: 'Refresh token not found',
      };
    }
  }

  //refresh token
  async refreshValidate(
    refreshToken: string,
  ): Promise<RefreshPayloadUserInterface>  {
    const decodedToken = this.token.decodeRefreshToken(refreshToken);

    if (!decodedToken.userId || !decodedToken.iat || !decodedToken.exp) {
      throw new UnauthorizedException('Refresh token is invalid');
    }
    const user = await this.user.getUserById(decodedToken.userId);
    if (!user) {
      throw new UnauthorizedException('User from refresh token not found');
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

  // going to facebook for authentication
  getFacebookAuthUrl(): string {
    const appId = this.configService.get<string>('FACEBOOK_CLIENT_ID');
    const redirectUri = this.configService.get<string>('FACEBOOK_CALLBACK_URL');

    return `https://www.facebook.com/v12.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=email`;
  }


  // Отримую access_token за code фейсбука
  async handleFacebookCallback(code: string): Promise<any> {
    const appId = this.configService.get<string>('FACEBOOK_CLIENT_ID');
    const appSecret = this.configService.get<string>('FACEBOOK_CLIENT_SECRET');
    const redirectUri = this.configService.get<string>('FACEBOOK_CALLBACK_URL');
    // Запит на отримання access_token
    const tokenResponse = await axios.get(`https://graph.facebook.com/v12.0/oauth/access_token`, {
      params: {
        client_id: appId,
        client_secret: appSecret,
        redirect_uri: redirectUri,
        code,
      },
    });

    const accessToken = tokenResponse.data.access_token;
    // Отримую дані користувача
    const userResponse = await axios.get('https://graph.facebook.com/me', {
      params: {
        access_token: accessToken,
        fields: 'first_name,last_name,email,picture'
      },
    });

    const user = userResponse.data;
    if (!user.email) {
      this.logger.error('Facebook account does not have an email address');
      throw new Error('Facebook account does not have an email address');
    }

    const userExist = await this.user.getUserByEmail(user.email);
    if (!userExist) {
      const newUser = await this.user.createUser({
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        password: process.env.USER_DEFOULT_PASSWORD,
      });
      if (!newUser) {
        this.logger.error('User registration failed');
        throw new Error('User registration failed');
      }

      const getUser = await this.user.getUserByEmail(user.email);
      console.log("GET-USER", getUser);
      await this.userRole.addDefaultRoleToUser(getUser.id);
      const payloadUser = await this.accessResponse(getUser);
      const refresh = await this.token.generateRefreshToken(getUser);

      return {
          payload: payloadUser,
          refreshToken: refresh,
        };
    }

    const payloadUser = await this.token.generateAccessToken(user);
    const refresh = await this.token.checkGenerateRefreshToken(userExist);

    return {
      payload: payloadUser,
      refreshToken: refresh,
    };
  }


}