import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserInterfaces } from '../user/interfaces/user.interfaces';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<UserInterfaces> {
    const getHashedPassword = await bcrypt.hash(createUserDto.password, 10);
    return await this.usersService.createUser({
      ...createUserDto,
      password: getHashedPassword,
    });
  }

  async generateAccessToken(user: UserInterfaces): Promise<any> {
    const payload = {
      userId: user.id,
      role: user.role,
    };
    return await this.jwtService.signAsync(payload);
  }

  
}
