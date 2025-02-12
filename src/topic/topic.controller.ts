import { Body, Controller, Get, HttpStatus, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TopicService } from '@/src/topic/topic.service';
import { TopicDto } from '@/src/topic/dto/topic.dto';
import { AddTopicDto } from '@/src/topic/dto/add-topic.dto';
import { UpdateTopicNameDto } from '@/src/topic/dto/update-topic-name.dto';

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



  @ApiOperation({
    summary: "Get Topic by id",
    description: "Get Topic by id"
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Topic description"
  })
  @Get(':id')
  async getTopicById(@Param('id', new ParseUUIDPipe) id: string): Promise<any> {
    return await this.topicService.getTopicById(id);
  }



  @ApiOperation({
    summary: "Create Topic",
    description: "Create new Topic"
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Topic ID"
  })
  @Post()
  async createTopic(@Body() addTopicDto: AddTopicDto): Promise<any> {
    return await this.topicService.createTopic(addTopicDto);
  }



  @ApiOperation({
    summary: "Update topic name. Accept topicName and newTopicName",
    description: "Change topic name"
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Updated status"
  })
  @Patch('/update')
  async updateTopic(@Body() updateTopicNameDto: UpdateTopicNameDto, ): Promise<TopicDto> {
    return await this.topicService.updateTopic(updateTopicNameDto)
  }
}
