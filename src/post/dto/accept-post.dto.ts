import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class AcceptPostDto {
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
  @IsOptional()
  userId?: string;


  @ApiProperty({ example: 'Topic name', description: 'Topic name' })
  @IsString()
  topicName: string;
}