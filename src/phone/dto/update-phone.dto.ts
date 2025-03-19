import { ApiProperty, PartialType } from '@nestjs/swagger';
import { PhoneDto } from '@/src/phone/dto/phone.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePhoneDto extends PartialType(PhoneDto){
  @ApiProperty({ example: 'new phone number', description: 'new phone number' })
  @IsString()
  @IsNotEmpty()
  newPhone: string;
}