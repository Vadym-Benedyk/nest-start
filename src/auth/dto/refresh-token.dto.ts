import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({ example: 'refresh_token', description: 'refresh token' })
  @IsNotEmpty({ message: 'The refresh token is required' })
  @IsString()
  refreshToken: string;
}
