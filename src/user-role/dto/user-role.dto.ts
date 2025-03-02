import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UserRoleDto {
  @ApiProperty({
    example: 'UUID',
    description: 'roleId',
  })
  @IsString()
  @IsNotEmpty()
  roleId: string;


  @ApiProperty({
    example: 'UUID',
    description: 'userId',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;


  // @ApiPropertyOptional({
  //   example: '',
  //   description: 'creation data',
  // })
  // @IsDate()
  // createdAt?: Date;
  //
  //
  // @ApiPropertyOptional({
  //   example: '',
  //   description: 'creation data',
  // })
  // @IsDate()
  // updatedAt?: Date;
}