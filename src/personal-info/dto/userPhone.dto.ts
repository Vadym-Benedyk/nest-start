import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserPhoneDto {
  @ApiProperty({ example: 'UUID', description: 'foreign key "userId" from users' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiPropertyOptional({ example: 'phone number', description: 'phone number' })
  @IsString()
  @IsNotEmpty()
  phone: string;
}