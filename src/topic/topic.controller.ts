import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TopicService } from '@/src/topic/topic.service';
import { AddTopicDto } from '@/src/topic/dto/add-topic.dto';
import { UpdateTopicNameDto } from '@/src/topic/dto/update-topic-name.dto';
import { DeleteTopicDto } from '@/src/topic/dto/delete-topic.dto';
import {
  AllTopicsInterface,
  IdInterface,
  IdTopicInterface,
  StatusMessageInterface,
} from '@/src/topic/interfaces/topic.interface';
import { Permissions } from '@/src/auth/decorators/get-permission.decorator';
import { JwtAuthGuard } from '@/src/auth/guards/JwtAuthGuard';
import { PermissionsGuard } from '@/src/auth/guards/PermissionsGuard';
import { TopicDto } from '@/src/topic/dto/topic.dto';
import { ToLowercasePipe } from '@/src/topic/pipes/to-lower-case.pipe';


@Controller('topic')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}


  @ApiOperation({
    summary: 'Get all topics',
    description: 'Get all topics',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: [TopicDto]
  })
  @Get()
  async getAllTopics(): Promise<AllTopicsInterface[]>  {
    return await this.topicService.getAllTopics();
  }


  @ApiOperation({
    summary: "Get Topic by id",
    description: "Get Topic by id"
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Topic description",
    type: AddTopicDto
  })
  @Get(':id')
  async getTopicById(@Param('id', new ParseUUIDPipe) id: string): Promise<IdTopicInterface> {
    return await this.topicService.getTopicById(id);
  }


  @ApiBearerAuth()
  @Permissions('create_topic')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiOperation({
    summary: "Create Topic",
    description: "Create new Topic"
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Topic ID"
  })
  @Post()
  async createTopic(@Body(new ToLowercasePipe(['topicName', 'chapterName'])) addTopicDto: AddTopicDto): Promise<IdInterface> {
    return await this.topicService.createTopic(addTopicDto);
  }


  @ApiBearerAuth()
  @Permissions('update_topic')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiOperation({
    summary: "Update topic name. Accept topicName and newTopicName",
    description: "Change topic name"
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Updated status"
  })
  @Patch('/update')
  async updateTopic(@Body() updateTopicNameDto: UpdateTopicNameDto, ): Promise<StatusMessageInterface> {
    return await this.topicService.updateTopic(updateTopicNameDto)
  }


  @ApiBearerAuth()
  @Permissions('delete_topic')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @ApiOperation({
    summary: "Delete topic",
    description: "Delete topic"
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Removed topic"
  })
  @Delete('/delete')
  async deleteTopic(@Query() deleteTopicDto: DeleteTopicDto): Promise<StatusMessageInterface> {
    return await this.topicService.deleteTopic(deleteTopicDto);
  }
}
