import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';


export class SmsDto {
  @ApiProperty({
    example: 'Hello, welcome to Posters',
    description: 'SMS body',
  })
  @IsString()
  @IsNotEmpty()
  body: string;


  @ApiProperty({
    example: '+15558675310',
    description: 'Recipient phone number',
  })
  @IsString()
  @IsNotEmpty()
  to: string;
}