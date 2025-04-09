import { Injectable } from '@nestjs/common';
import { UserService } from '@/src/users/user.service';
import { RefreshService } from '@/src/refresh/refresh.service';
import { UserRoleService } from '@/src/user-role/user-role.service';
import * as process from 'node:process';
import { CreateUserDto } from '@/src/auth/dto/create-user.dto';
import { GoogleInterface } from '@/src/strategies/google/interfaces/google.interface';
import { LoggerFacadeService } from '@/src/logger/logger-facade.service';

@Injectable()
export class GoogleService {
  constructor(
    private readonly userService: UserService,
    private readonly token: RefreshService,
    private readonly userRole: UserRoleService,
    private readonly logger: LoggerFacadeService
  ) {}

  async validateUser(profile: any, accessToken: string) {

    return {
      googleUserId: profile?.id || null,
      email: profile?.emails[0].value || null,
      firstName: profile?.name.givenName || '',
      lastName: profile?.name.familyName || '',
      picture: profile?.photos[0].value || null,
      accessToken,
    };
  }

  async createUser(user: CreateUserDto): Promise<GoogleInterface> {
    const userExist = await this.userService.getUserByEmail(user.email);
    if (userExist) {
      const payloadUser: string = await this.token.generateAccessToken(userExist.id);
      const refreshToken = await this.token.generateRefreshToken(userExist.id);
      return {
        payload: payloadUser,
        refreshToken: refreshToken,
      };
    }

    //Add default password
    const userWithPassword = {
      ...user,
      password: process.env.USER_DEFAULT_PASSWORD,
    }

    try {
      const newUser = await this.userService.createUser(userWithPassword);
      await this.userRole.addDefaultRoleToUser(newUser.id);
      const payloadUser = await this.token.generateAccessToken(newUser.id);
      const refreshToken = await this.token.generateRefreshToken(newUser.id);
      return {
        payload: payloadUser,
        refreshToken: refreshToken,
      };
    } catch (error) {
      this.logger.error(`Failed to create user from google account. Error: ${error}`, GoogleService.name);
      throw new Error('Failed to create user from google. Error: ' + error)
    }

  }
}

