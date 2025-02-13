import { IsString } from 'class-validator';

export class DeleteTopicDto {
  @IsString()
  topicName: string;
}