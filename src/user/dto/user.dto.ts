import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsNumber,
  Min,
  Max,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { UserRole } from '../interfaces/role.enum';

export class UserDto {
  @ApiProperty({ example: 'John', description: 'first name' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'last name' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'john.doe@mail.com', description: 'email' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password', description: 'password' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 25,
    description: 'The age of the user. Must be between 18 and 65.',
    minimum: 18,
    maximum: 65,
  })
  @IsNumber()
  @Min(18)
  @Max(65)
  age: number;

  @ApiProperty({
    example: UserRole.GUEST,
    description: 'The role of the user.',
    enum: UserRole,
    default: UserRole.GUEST,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole = UserRole.GUEST;
}
