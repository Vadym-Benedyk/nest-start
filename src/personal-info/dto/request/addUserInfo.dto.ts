import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { StatusEnum } from '@/src/personal-info/interfaces/personal-info.interface';

export class AddUserInfoDto {
  @ApiProperty({
    example: 'userId UUID type',
    description: 'userId from a foreign table users',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: 'user age', description: 'user age' })
  @IsInt()
  @IsOptional()
  age?: number;

  @ApiProperty({
    example: 'married | divorced | single | widowed | separated | other...',
    description: 'civic status',
  })
  @IsEnum(StatusEnum, { message: 'status must be one of the provided values' })
  @IsOptional()
  status?: StatusEnum;

  @ApiProperty({ example: 'URL', description: 'photo url' })
  @IsString()
  @IsOptional()
  photo?: string;
}
