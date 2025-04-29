import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class AuthResponseDto {
  @ApiProperty({ example: 'success', description: 'status' })
  @IsString()
  status: string;

  @ApiPropertyOptional({ example: 'token', description: 'token' })
  @IsOptional()
   // @ValidateNested()
  //   @Type(() => DTO)
  data?: object;
}
