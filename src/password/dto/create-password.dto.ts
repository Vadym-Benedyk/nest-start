import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePasswordDto {
  @ApiProperty({ example: 'password', description: 'password' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ example: 'UUID', description: 'userId' })
  @IsNotEmpty()
  @IsString()
  userId: string;
}
