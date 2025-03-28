import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'id', description: 'UUIDV4' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  id?: string;

  @ApiProperty({ example: 'Giulio', description: 'first name' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Cesare', description: 'last name' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'giulio.cesare@romain.empire', description: 'email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password', description: 'password' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
