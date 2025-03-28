import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FbTokenDto {
  @ApiProperty({
    example: 'ksdnvk45kd23jq9tgjfdj...',
    description: 'token from facebook API'
  })
  @IsString()
  @IsNotEmpty()
  token: string
}