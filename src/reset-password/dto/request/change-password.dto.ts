import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    example: 'gerald.ford@whitehouse.gov',
    description: 'Email of the user who wants to change the password',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
