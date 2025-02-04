import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class ConfirmNewPasswordDto {
  @ApiProperty({
    example: 'password',
    description: 'new password',
  })
  @MinLength(8)
  @MaxLength(20)
  @IsString()
  password: string;

  @ApiProperty({
    example: 'gewrg544@ggr5%fe4r4trer',
    description: 'reset password token',
  })
  @IsString()
  resetToken: string;
}
