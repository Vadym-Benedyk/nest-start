import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { UserDto } from '../user/dto/user.dto';
import { UserInterfaces } from '../user/interfaces/user.interfaces';
import { AuthenticationPayloadInterface } from '../refresh/interfaces/refresh.interfaces';
import { RefreshService } from '../refresh/refresh.service';
import { LoginUserDto } from './dto/login-user.dto';

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
    refresh?: string,
  ): AuthenticationPayloadInterface {
    return {
      user: user,
      payload: {
        type: 'bearer',
        token: access,
        ...(refresh ? { refreshToken: refresh } : {}),
      },
    };
  }

  // Register a new user and return tokens
  async registerUser(userDto: UserDto) {
    // Check if user already exists
    const userExist = await this.user.getUserByEmail(userDto.email);
    if (userExist) {
      throw new UnauthorizedException('User already exists');
    }
    // Create user
    const user = await this.updateUserPassword(userDto);
    // Generate tokens
    if (user) {
      const access = await this.token.generateAccessToken(user);
      const refresh = await this.token.generateRefreshToken(user);
      return this.buildResponsePayload(user, access, refresh);
    } else {
      throw new Error('Failed to register user');
    }
  }
  // Login
  async loginUser(loginUserDto: LoginUserDto) {
    const user = await this.user.getUserByEmail(loginUserDto.email);
  }
}
