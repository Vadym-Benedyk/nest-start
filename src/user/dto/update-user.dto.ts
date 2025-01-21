import { ApiProperty, PartialType } from '@nestjs/swagger';
import { UserDto } from './user.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(UserDto) {
  @ApiProperty({ example: 'id', description: 'id' })
  @IsString()
  @IsNotEmpty()
  id: string;
}
