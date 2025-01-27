import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class AuthResponseDto {
  @ApiProperty({ example: 'success', description: 'status' })
  @IsString()
  status: string;

  @ApiProperty({ example: 'token', description: 'token' })
  @IsOptional()
  data?: object;
}
