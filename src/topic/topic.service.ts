import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TopicRepository } from '@/src/topic/repositories/topic.repository';
import { AddTopicDto } from '@/src/topic/dto/add-topic.dto';
import { ChapterRepository } from '@/src/chapter/repositories/chapter.repository';

@Injectable()
export class TopicService {
  constructor(
    private readonly topicRepository: TopicRepository,
    private readonly chapterRepository: ChapterRepository
  ) {}

  async getAllTopics(): Promise<any> {
    return this.topicRepository.getAllTopics()
  }

  async getTopicById(id: string): Promise<any> {
    const topic = await this.topicRepository.findTopicById(id);
    if (!topic || topic.length === 0) {
      throw new HttpException(
        'Topic not found',
        HttpStatus.NOT_FOUND
      )
    }
    return topic
  }

  async createTopic(addTopicDto: AddTopicDto): Promise<any> {
    const isTopicInDb = await this.topicRepository.findTopicByName(addTopicDto.topicName)

    if (isTopicInDb && isTopicInDb.length !== 0) {
      throw new HttpException(
        `Topic with name ${addTopicDto.topicName} already exist in database `,
        HttpStatus.NOT_ACCEPTABLE
        )
    }
    const isChapterInDb = await this.chapterRepository.findByChapterName(addTopicDto.chapterName);
    if (!isChapterInDb) {
      throw new HttpException(
        `There isn\'t any chapter with name ${addTopicDto.chapterName}. Please add first Chapter to DB`,
        HttpStatus.NOT_FOUND
      )
    }

    const result = await this.topicRepository.createTopic(addTopicDto, isChapterInDb.id)
    return result.identifiers[0]?.id;
  }
}