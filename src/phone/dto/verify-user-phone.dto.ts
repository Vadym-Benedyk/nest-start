import { PhoneDto } from '@/src/phone/dto/phone.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class VerifyUserPhoneDto extends PhoneDto {
  @ApiProperty({ example: 'true/false', description: 'verify user phone status'
  })
  @IsBoolean()
  @IsNotEmpty()
  verified: boolean;
}