import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UserService } from '@/src/users/user.service';
import { UserInterfaces } from '@/src/users/interfaces/user.interfaces';
import { PayloadUserInterface, RefreshPayloadUserInterface } from '../refresh/interfaces/refresh.interfaces';
import { RefreshService } from '../refresh/refresh.service';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import * as process from 'node:process';
import { UserRoleService } from '@/src/user-role/user-role.service';
import { RefreshStatusInterface } from '@/src/auth/interfaces/createUser.interface';
import axios from 'axios';
import { FbTokenDto } from '@/src/auth/dto/fb-token.dto';



@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly user: UserService,
    private readonly token: RefreshService,
    private readonly userRole: UserRoleService
  ) {
  }

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
    //Getting user from email
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
    //Nearby data expiration range for checking soon expiration token
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


  async postFacebookToken( fbTokenDto: FbTokenDto): Promise<any> {
    try {
      // Перевіряємо токен Facebook
      const fbResponse = await axios.get('https://graph.facebook.com/me', {
        params: {
          access_token: fbTokenDto.token,
          fields: 'id,name,email'
        }
      })

      if (fbResponse.data) {
        console.log("Fb user info", fbResponse.data);
        return fbTokenDto.token
      }

    } catch (error) {
      throw new UnauthorizedException('Invalid Facebook token')
    }


  }


  //   const user = fbResponse.data; // { id, name, email }
  //   console.log("U S E R", user);
  // return res.status(200).json(token);
  // Додаємо або авторизуємо користувача
  // const jwtTokens = await this.authService.authenticateFacebookUser(user);

  // Відправляємо JWT-токени у відповідь
  // return res.json(jwtTokens);
  // } catch (error) {
  //   return res.status(401).json({ message: 'Invalid Facebook token' });
  // }


}