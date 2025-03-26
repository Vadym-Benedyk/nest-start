import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GoogleService } from './google.service';
import { cookiesGenerator } from '@/src/auth/utility/cookiesGenerator';
import { Response } from 'express';


@Controller('auth/google')
export class GoogleController {
  constructor(private readonly googleService: GoogleService) {}

  @Get()
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Перенаправлення на  OAuth
  }

  @Get('callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: any, @Res() res: Response): Promise<any> {
    try {
      const { payload, refreshToken } = await this.googleService.createUser(req.user);
      cookiesGenerator(res, refreshToken);

      return res.redirect(process.env.NGROK_DOMAIN+`?access_token=${payload}`)
    } catch (error) {
      return res.status(400).json({ status: 'error', message: error });
    }
  }
}