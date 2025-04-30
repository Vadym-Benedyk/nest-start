import { HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from '@/src/users/user.service';
import { PayloadUserInterface, RefreshPayloadUserInterface } from '../refresh/interfaces/refresh.interfaces';
import { RefreshService } from '../refresh/refresh.service';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import * as process from 'process';
import { UserRoleService } from '@/src/user-role/user-role.service';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { LoggerFacadeService } from '@/src/logger/logger-facade.service';
import { LogOutInterface } from '@/src/users/interfaces/user.interfaces';
import { UserSecureDto } from '@/src/users/dto/user-secure.dto';


@Injectable()
export class AuthService {
  constructor(
    private readonly user: UserService,
    private readonly token: RefreshService,
    private readonly userRole: UserRoleService,
    private readonly configService: ConfigService,
    private readonly logger: LoggerFacadeService,
  ) {}

  async accessResponse(user: UserSecureDto): Promise<PayloadUserInterface> {
    try {
      const access: string = await this.token.generateAccessToken(user.id);
      return {
        user: user,
        payload: {
          type: 'bearer',
          token: access,
        },
      };
    } catch (error) {
      this.logger.error(`Failed to generate access token. Error: ${error}`, AuthService.name);
      throw new Error('Failed to generate tokens. Error: ' + error);
    }
  }

  // Register a new users and return tokens
  async registerUser(user: CreateUserDto): Promise<RefreshPayloadUserInterface> {
    // Create users and hash password in database
    const newUser = await this.user.createUser(user);

    const { password, ...secureUser } = newUser;

    const payloadUser = await this.accessResponse(secureUser);

    const refresh = await this.token.generateRefreshToken(newUser.id);
    // Add default role to user when register
    const addRole = await this.userRole.addDefaultRoleToUser(newUser.id);
    if (payloadUser && refresh && addRole) {
      this.logger.log('User was successfully registered in DB', AuthService.name);
      return {
        payload: payloadUser,
        refreshToken: refresh,
      };
    }
  }

  // Login
  async loginUser(
    loginData: LoginUserDto,
  ): Promise<RefreshPayloadUserInterface> {
    //Get user from email
    const user = await this.user.getUserByEmail(loginData.email);
    if (!user) {
      throw new UnauthorizedException('Login not found');
    }
    //Check coincidence password hash
    const passwordMatch = await this.user.validatePassword(
      user.id,
      loginData.password,
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


  async logoutUser(userId: string): Promise<LogOutInterface> {
    const deletedTokens = await this.token.deleteRefreshToken(userId);
    if (deletedTokens) {
      this.logger.log('Logout successful', AuthService.name);
      return {
        status: HttpStatus.OK,
        message: 'Logout successful',
      };
    } else {
      this.logger.log('Logout get started but refresh token not found', AuthService.name)
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'Refresh token not found',
      };
    }
  }

  //refresh token
  async refreshValidate(refreshToken: string): Promise<RefreshPayloadUserInterface>  {
    const { userId, iat, exp } = this.token.decodeRefreshToken(refreshToken);

    if (!userId || iat || !exp) {
      throw new UnauthorizedException('Refresh token is invalid');
    }
    const user = await this.user.getUserById(userId);
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
    const decodedTokenExpiration = new Date(exp * 1000).getTime();

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

    const accessPayload = await this.accessResponse(user);

    //If expiration date leas then 3 days remaining let's generate both tokens, else gen access token only
    if (decodedTokenExpiration < expTokenRange) {
      const refresh = await this.token.generateRefreshToken(user.id);
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
    let accessToken: string;

    try {
      const tokenResponse = await axios.get(`https://graph.facebook.com/v12.0/oauth/access_token`, {
        params: {
          client_id: appId,
          client_secret: appSecret,
          redirect_uri: redirectUri,
          code,
        },
      });

      accessToken = tokenResponse.data.access_token;
    } catch (error) {
      this.logger.error(`Failed to get access token from Facebook. Error: ${error}`, AuthService.name);
      throw new NotFoundException('Failed to get access token from Facebook');
    }

    // Отримую дані користувача
    let user: any;
    try {
      const userResponse = await axios.get('https://graph.facebook.com/me', {
        params: {
          access_token: accessToken,
          fields: 'first_name,last_name,email,picture'
        },
      });

      user = userResponse.data;
    } catch (error) {
      this.logger.error(`Failed to get user data from Facebook.. Error: ${error}`, AuthService.name);
      throw new NotFoundException('Failed to get user data from Facebook');
    }

    if (!user.email) {
      this.logger.error('Facebook account does not have an email address', AuthService.name);
      throw new Error('Facebook account does not have an email address');
    }

    const userExist = await this.user.getUserByEmail(user.email);
    if (!userExist) {
      const newUser = await this.user.createUser({
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        password: process.env.USER_DEFAULT_PASSWORD,
      });
      if (!newUser) {
        this.logger.error('User registration failed', AuthService.name);
        throw new Error('User registration failed');
      }

      // const getUser = await this.user.getUserByEmail(user.email);
      await this.userRole.addDefaultRoleToUser(newUser.id);
      const payloadUser = await this.accessResponse(newUser);
      const refresh = await this.token.generateRefreshToken(newUser.id);

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