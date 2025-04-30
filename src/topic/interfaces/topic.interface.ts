import { HttpStatus } from '@nestjs/common';

export interface StatusMessageInterface {
  statusCode: HttpStatus,
  message: string
}

export interface AllTopicsInterface {
  topicName: string
}

export interface IdTopicInterface {
  id: string
  topicName: string
}

export interface IdInterface {
  id: string
}

export interface TopicInterface {
  id: string,
  topicName: string,
  chapterId: string
}