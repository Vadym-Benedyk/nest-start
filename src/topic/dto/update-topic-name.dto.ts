import { ApiProperty, PartialType } from '@nestjs/swagger';
import { AddTopicDto } from '@/src/topic/dto/add-topic.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTopicNameDto extends PartialType(AddTopicDto) {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  newTopicName: string
}