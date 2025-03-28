import { Injectable } from '@nestjs/common';
import { UserService } from '@/src/users/user.service';
import { RefreshService } from '@/src/refresh/refresh.service';
import { UserRoleService } from '@/src/user-role/user-role.service';
import * as process from 'node:process';

@Injectable()
export class GoogleService {
  constructor(
    private readonly userService: UserService,
    private readonly token: RefreshService,
    private readonly userRole: UserRoleService,
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

  async createUser(user: any): Promise<any> {
    const userExist = await this.userService.getUserByEmail(user.email);
    if (userExist) {
      const payloadUser = await this.token.generateAccessToken(userExist);
      const refreshToken = await this.token.generateRefreshToken(userExist);
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
      const payloadUser = await this.token.generateAccessToken(newUser);
      const refreshToken = await this.token.generateRefreshToken(newUser);
      return {
        payload: payloadUser,
        refreshToken: refreshToken,
      };
    } catch (error) {
      throw new Error('Failed to create user from google. Error: ' + error)
    }

  }
}

