import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TopicService } from '@/src/topic/topic.service';

@Controller('topic')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @ApiOperation({
    summary: 'Get all topics',
    description: 'Get all topics',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Success',
  })
  @Get()
  async getAllTopics() {
    return await this.topicService.getAllTopics();
  }
}
