import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express'
import * as path from 'node:path';



@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({
    summary: 'Main page',
    description: 'Main page for getting user data'
  })
  @ApiResponse({ status: 200, description: 'Returns the main page HTML file' })
  @Get('/')
  getMain(@Res() res: Response) {
    const filePath = this.appService.getMain();

    if (!filePath) {
      res.status(404).send('File not found');
      return '<h2>Hello from Poster!</h2>'
    }

    return res.sendFile(filePath);
  }

  @ApiOperation({
    summary: 'Privacy policy',
    description: 'Privacy policy for getting user privacy data'
  })
  @ApiResponse({ status: 200, description: 'Returns the privacy policy HTML file' })
  @Get('/privacy_policy')
  getPrivacyPolicy(@Res() res: Response) {
    const filePath = path.join(__dirname, '..', 'static', 'privacy', 'privacy_policy.html');
    return res.sendFile(filePath);
  }

  @ApiOperation({
    summary: 'Terms of service and delete data instructions',
    description: 'Terms of service for getting user terms of service data'
  })
  @ApiResponse({ status: 200, description: 'Returns the terms of service HTML file' })
  @Get('/terms_of_service')
  getTermsOfService(@Res() res: Response) {
    const filePath = this.appService.getTermsOfService();
    if (!filePath) {
      res.status(404).send('File not found');
      return '<h2>Hello from Poster!</h2>'
    }
    return res.sendFile(filePath);
  }
}
