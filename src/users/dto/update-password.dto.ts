import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({ example: 'id', description: 'user id' })
  @IsUUID()
  @IsNotEmpty()
  id: string;


  @ApiProperty({ example: 'password', description: 'password' })
  @IsString()
  @IsNotEmpty()
  password: string;
}