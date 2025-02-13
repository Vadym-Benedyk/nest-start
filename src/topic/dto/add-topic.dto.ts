import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class AddTopicDto {
  @ApiProperty({
    example: 'Prepare to vacancy',
    description: 'Topic name'
  })
  @IsString()
  @IsNotEmpty()
  topicName: string

  @ApiProperty({
    example: 'Adventures',
    description: 'Exist Chapter name'
  })
  @IsString()
  @IsNotEmpty()
  chapterName: string
}