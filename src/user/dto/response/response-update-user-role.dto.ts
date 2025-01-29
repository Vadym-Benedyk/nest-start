import { ApiProperty } from '@nestjs/swagger';

export class ResponseUpdateUserDto {
  @ApiProperty({ example: '1', description: 'Number of updated rows' })
  updates: number;

  @ApiProperty({ example: 'User', description: 'Updated user object' })
  user: object;
}
