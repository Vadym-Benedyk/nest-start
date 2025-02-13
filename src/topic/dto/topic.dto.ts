import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { AddTopicDto } from '@/src/topic/dto/add-topic.dto';

export class TopicDto extends PartialType(AddTopicDto) {
  @ApiProperty({ example: '1816f2e7-3663-42a5-9fd9-27a7eed23879', description: 'topic uuid' })
  @IsUUID()
  @IsNotEmpty()
  id: string
}