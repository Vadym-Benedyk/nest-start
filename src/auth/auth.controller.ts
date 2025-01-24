import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Create new user',
    description: 'Registration new user',
  })
  @ApiResponse({ type: CreateUserDto })
  @Post('register')
  public async register(@Body() createUserDto: CreateUserDto) {
    const payload = await this.authService.registerUser(createUserDto);

    return {
      status: 'success',
      data: payload,
    };
  }

  @ApiOperation({
    summary: 'Authorization',
    description: 'Login user by email & password',
  })
  @ApiResponse({ type: CreateUserDto })
  @Post('login')
  public async login(@Body() loginUserDto: LoginUserDto) {
    const payload = await this.authService.loginUser(loginUserDto);

    return {
      status: 'success',
      data: payload,
    };
  }

  @ApiOperation({
    summary: 'Refresh token',
    description: 'Refresh token',
  })
  @Post('/refresh')
  public async refresh(@Body() body: RefreshTokenDto): Promise<any> {
    try {
      return await this.authService.refreshValidate(body.refreshToken);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
