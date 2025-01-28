import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'id', description: 'UUIDV4' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ example: 'John', description: 'first name' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ example: 'Doe', description: 'last name' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ example: 'john.doe@mail.com', description: 'email' })
  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'password', description: 'password' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  password?: string;
}
