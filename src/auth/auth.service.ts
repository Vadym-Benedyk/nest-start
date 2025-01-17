import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserInterfaces } from '../user/interfaces/user.interfaces';
import { AuthenticationPayloadInterface } from '../refresh/interfaces/refresh.interfaces';
import { RefreshService } from '../refresh/refresh.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly user: UserService,
    private readonly token: RefreshService,
  ) {}

  // Hash the password and create a new user
  async signUp(createUserDto: CreateUserDto): Promise<UserInterfaces> {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      return await this.user.createUser({
        ...createUserDto,
        password: hashedPassword,
      });
    } catch (error) {
      throw new Error('Failed to create user: ' + error);
    }
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
  async registerUser(createUserDto: CreateUserDto) {
    // Check if user already exists
    const userExist = await this.user.getUserByEmail(createUserDto.email);
    if (userExist) {
      throw new UnauthorizedException('User already exists');
    }

    let user: UserInterfaces;
    let access: string;
    let refresh: string;

    try {
      // Create user
      user = await this.signUp(createUserDto);
      // Generate tokens
      access = await this.token.generateAccessToken(user);
      refresh = this.token.generateRefreshToken(user.id);
    } catch (error) {
      throw new Error('Failed to register user: ' + error);
    }

    return this.buildResponsePayload(user, access, refresh);
  }
}
