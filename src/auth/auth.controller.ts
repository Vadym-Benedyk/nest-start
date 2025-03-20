import { Body, Controller, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Response } from 'express';
import { cookiesGenerator, resetCookies } from './utility/cookiesGenerator';
import { AuthResponseDto } from './dto/auth-response.dto';
import { CreateUserDataInterface, RefreshStatusInterface } from '@/src/auth/interfaces/createUser.interface';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Create new user',
    description: 'Registration new user',
  })
  @ApiResponse({ type: CreateUserDto })
  @Post('register')
  public async registerUser(
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
  ): Promise<CreateUserDataInterface> {

    try {
      const { payload, refreshToken } = await this.authService.registerUser(createUserDto);
      cookiesGenerator(res, refreshToken);

      return res.status(201).json({
        status: 'success',
        data: payload
      });
    } catch (error) {
      return res.status(400).json({
        status: error
      });
    }
  }


  @ApiOperation({
    summary: 'Authentication',
    description: 'Login users by email & password',
  })
  @ApiResponse({ type: CreateUserDto })
  @Post('login')
  public async login(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    try {
      const { payload, refreshToken } =
        await this.authService.loginUser(loginUserDto);
      cookiesGenerator(res, refreshToken);
      return res.status(200).json({
        status: 'success',
        data: payload,
      });
    } catch (error) {
      return res.status(401).json({
        status: 'error',
        error: error,
      });
    }
  }


  @ApiOperation({
    summary: 'Logout',
    description: 'Logout users',
  })
  @ApiResponse({ status: 200 })
  @Post('logout/:userId')
  public async logout(@Param('userId') userId: string, @Res() res: Response): Promise<any> {
    resetCookies(res);
    const result = await this.authService.logoutUser(userId);
    return res.status(result.status).json(result);
  }


  @ApiOperation({
    summary: 'Refresh token',
    description: 'Refresh token',
  })
  @ApiResponse({ type: AuthResponseDto })
  @Post('/refresh')
  public async refresh(@Body() body: RefreshTokenDto, @Res() res: Response) {
    try {
      const { payload, refreshToken } = await this.authService.refreshValidate(
        body.refreshToken,
      );
      cookiesGenerator(res, refreshToken);
      return res.status(200).json({
        status: 'success',
        data: payload,
      });
    } catch (error) {
      return res.status(401).json({
        status: 'error',
        error: error,
      });
    }
  }
}
