import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';


export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ example: 'id', description: 'id' })
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
