import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'id', description: 'UUIDV4' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ example: 'Giulio', description: 'first name' })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ example: 'Cesare', description: 'last name' })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ example: 'giulio.cesare@romain.empire', description: 'email' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'password', description: 'password' })
  @IsString()
  @IsOptional()
  password?: string;
}
