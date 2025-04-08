import { Body, Controller, Get, Param, Post, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Response } from 'express';
import { cookiesGenerator, resetCookies } from './utility/cookiesGenerator';
import { AuthResponseDto } from './dto/auth-response.dto';
import { CreateUserDataInterface } from '@/src/auth/interfaces/createUser.interface';
import { FbTokenDto } from '@/src/auth/dto/fb-token.dto';
import * as process from 'node:process';
import { PayloadUserInterface } from '@/src/refresh/interfaces/refresh.interfaces';
import { UserDto } from '@/src/users/dto/user.dto';
import { IdDto } from '@/src/users/dto/id.dto';
import { LogOutInterface } from '@/src/users/interfaces/user.interfaces';




@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Create new user',
    description: 'Registration new user',
  })
  @ApiResponse({ status: 201, type: UserDto })
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
      const { payload, refreshToken } = await this.authService.loginUser(loginUserDto);
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
  @ApiParam({ name: 'id', required: true, type: 'string', description: 'UUID of the user' })
  @ApiResponse({ status: 200 })
  @Post('logout/:id')
  public async logout(@Param() id: IdDto, @Res() res: Response): Promise<LogOutInterface> {
    resetCookies(res);
    return await this.authService.logoutUser(id.id);
  }


  @ApiOperation({
    summary: 'Refresh token',
    description: 'Refresh token',
  })
  @ApiResponse({ type: AuthResponseDto })
  @Post('refresh')
  public async refresh(@Body() body: RefreshTokenDto, @Res() res: Response): Promise<Response<PayloadUserInterface>> {
    try {
      const { payload, refreshToken } = await this.authService.refreshValidate(
        body.refreshToken,
      );
      cookiesGenerator(res, refreshToken);
      return res.status(200).json({
        status: 'success',
        payload: payload,
      });
    } catch (error) {
      return res.status(401).json({
        status: 'error',
        payload: error,
      });
    }
  }

//-------------------------------------- F B -----------------------------------------
  @ApiOperation({
    summary: 'Get facebook token',
    description: 'Generate authorization URL for facebook',
  })
  @ApiResponse({ type: FbTokenDto })
  @Get('facebook')
  async redirectToFacebook(@Res() res: Response): Promise<void> {
    const url = this.authService.getFacebookAuthUrl();
    //facebook login url redirect
    return res.redirect(url);
  }


  @ApiOperation({
    summary: 'Facebook redirect',
    description: 'Elaborate facebook redirect',
  })
  @ApiResponse({ })
  @Get('facebook/callback')
  async facebookCallback(@Query('code') code: string, @Res() res: Response): Promise<any> {
    try {
      const { payload, refreshToken } = await this.authService.handleFacebookCallback(code);
      cookiesGenerator(res, refreshToken);

      return res.redirect(process.env.NGROK_DOMAIN+`?access_token=${payload}`)
    } catch (error) {
      return res.status(400).json({ status: 'error', message: error });
    }
  }
}
