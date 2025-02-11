import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TopicEntity } from '@/src/topic/entities/topic.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TopicRepository {
  constructor(
    @InjectRepository(TopicEntity)
    private readonly topicRepository: Repository<TopicEntity>
  ) {}

  async getAllTopics(): Promise<any> {
    try {
      return this.topicRepository.find()
    } catch (error) {
      throw new HttpException(
        'Internal server error by getting topics list',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }
}