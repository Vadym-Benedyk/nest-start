import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { TopicRepository } from '@/src/topic/repositories/topic.repository';
import { AddTopicDto } from '@/src/topic/dto/add-topic.dto';
import { ChapterRepository } from '@/src/chapter/repositories/chapter.repository';
import { UpdateTopicNameDto } from '@/src/topic/dto/update-topic-name.dto';

@Injectable()
export class TopicService {
  private readonly logger = new Logger(TopicService.name)

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

  async updateTopic(updateTopicNameDto: UpdateTopicNameDto): Promise<any> {
    this.logger.log('start updating topic')

    const isTopic = await this.topicRepository.findTopicByName(updateTopicNameDto.topicName);
    if (!isTopic) {
      throw new HttpException(
        'We can\'t find topic with such name',
        HttpStatus.NOT_ACCEPTABLE
      )
    }

    const isChapter = await this.chapterRepository.findByChapterName(updateTopicNameDto.chapterName)
    if (!isChapter) {
      throw new HttpException(
        'No chapter found with such name',
        HttpStatus.NOT_FOUND
      )
    }

    return await this.topicRepository.updateTopic(updateTopicNameDto)

  }
}