import { CreateUserDto } from '../user/dto/create-user.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Create user', description: 'Create user' })
  @ApiResponse({ type: CreateUserDto })
  @Post('/register')
  public async register(@Body() req: CreateUserDto) {
    const payload = await this.authService.registerUser(req);

    return {
      status: 'success',
      data: payload,
    };
  }
}
