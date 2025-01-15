import { CreateUserDto } from '../user/dto/create-user.dto';
import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';


@Controller('/auth')
export class AuthController {
  private readonly users: UserService
  private readonly tokens: AuthService

  public constructor(users: UserService) {
    this.users = users
    // this.tokens = tokens
  }

  @Post('/register')
  public async register(@Body() req: CreateUserDto) {

      const validateUser = await this.users.getUserByEmail(req.email)
      if (validateUser) {
        throw new UnauthorizedException('User already exist')
      }

      const user = await this.tokens.signUp(req)
      const access = await this.tokens.generateAccessToken(user)
      const refresh = await this.tokens.generateRefreshToken(req)

  }
}