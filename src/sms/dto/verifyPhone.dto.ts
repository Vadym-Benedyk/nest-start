import { ApiProperty } from '@nestjs/swagger';
import { PhoneDto } from '@/src/phone/dto/phone.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyPhoneDto extends PhoneDto {
  @ApiProperty({
    example: '20345',
    description: 'One Time Passcode'
  })
  @IsNotEmpty()
  @IsString()
  verifyCode: string
}