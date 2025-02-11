import { Injectable } from '@nestjs/common';
import { TopicRepository } from '@/src/topic/repositories/topic.repository';

@Injectable()
export class TopicService {
  constructor(private readonly topicRepository: TopicRepository) {}

  async getAllTopics() {
    return this.topicRepository.getAllTopics()
  }
}