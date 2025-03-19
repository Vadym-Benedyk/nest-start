import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MAX, MAX_LENGTH } from 'class-validator';

export class PhoneDto {
  @ApiProperty({
    example: '19023458765',
    description: 'Request phone number'
  })
  @IsString()
  @IsNotEmpty()
  phone: string;
}