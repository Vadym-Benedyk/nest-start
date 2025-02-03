import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsDate, IsInt } from 'class-validator';

export class ResetUserTokenDto {
  @ApiProperty({
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    description: 'The unique identifier of the reset token',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    description: 'The unique identifier of the user',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    example: 'randomlyGeneratedTokenString',
    description: 'The reset token string',
  })
  @IsString()
  token: string;

  @ApiProperty({
    example: '2023-10-01T00:00:00.000Z',
    description: 'The date and time when the reset token was created',
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    example: '2023-10-01T00:00:00.000Z',
    description: 'The date and time when the reset token was last updated',
  })
  @IsDate()
  updatedAt: Date;

  @ApiProperty({
    example: '2023-10-01T01:00:00.000Z',
    description: 'The date and time when the reset token will expire',
  })
  @IsDate()
  expiresAt: Date;

  @ApiProperty({
    example: 0,
    description: 'The number of reset requests made with this token',
  })
  @IsInt()
  resetRequestCount: number;
}
