import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    example: 'Title of the post',
    description: 'Title of the post',
  })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Post', description: 'Content of the post' })
  @IsString()
  content: string;

  @ApiProperty({
    example: 'UUID',
    description: 'Id of the user who created the post',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
