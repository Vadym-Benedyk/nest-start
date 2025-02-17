import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class IdPostDto {

  @ApiProperty({
    example: 'UUID',
    description: 'Post Id',
  })
  @IsString()
  @IsNotEmpty()
  id: string;
}