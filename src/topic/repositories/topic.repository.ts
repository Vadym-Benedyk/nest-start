import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TopicEntity } from '@/src/topic/entities/topic.entity';
import { Repository } from 'typeorm';
import { AddTopicDto } from '@/src/topic/dto/add-topic.dto';

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


  async findTopicById(id: string): Promise<any> {
    try {
      return await this.topicRepository.findOneOrFail({ where: { id: id } })
    } catch (error) {
      throw new HttpException('Error fetching topic by id', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }


  async findTopicByName(topicName: string): Promise<any> {
    try {
      return await this.topicRepository.findBy({ topicName: topicName })
    } catch (error) {
      throw new HttpException('Error fetching topic name', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }


  async createTopic(topic: AddTopicDto, chapterId: string): Promise<any> {
    try {
      return await this.topicRepository.insert({
        topicName: topic.topicName,
        chapter: { id: chapterId }
      })
    } catch (error) {
      throw new HttpException('Problem with saving topic in database', HttpStatus.FORBIDDEN)
    }
  }

}