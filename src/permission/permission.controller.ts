import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { PermissionService } from '@/src/permission/permission.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AddPermissionDto } from '@/src/permission/dto/add-permission.dto';
import { PermissionDto } from '@/src/permission/dto/permission.dto';
import { PermissionInterface } from '@/src/permission/interfaces/permission.interface';
import { IdPermissionDto } from '@/src/permission/dto/id-permission.dto';


@ApiTags('Permissions')
@Controller('permission')
export class PermissionController {
  constructor(private  readonly permissionService: PermissionService) {}

  @ApiOperation({ summary: 'Get permission list', description: 'Get all permissions'})
  @ApiResponse({ type: [PermissionDto], status: 201 })
  @Get()
  async getAllPermissions(): Promise<PermissionInterface[]> {
    return this.permissionService.getAllPermissions();
  }


  @ApiOperation({ summary: 'Get permission by id', description: 'Get permission by id' })
  @ApiResponse({ type: PermissionDto, status: 201 })
  @Get(':id')
  async getPermissionById(@Param('id') id: string): Promise<PermissionInterface> {
    // console.log('type controller', typeof idPermission.id);
    return this.permissionService.getPermissionById(id);
  }


  @ApiOperation({ summary: 'Create permission', description: 'Create permission' })
  @ApiResponse({ type: AddPermissionDto, status: 201, description: 'Permission created' })
  @Post('permission')
  async createPermission(@Body() addPermissionDto: AddPermissionDto): Promise<PermissionInterface> {
    return this.permissionService.createPermission(addPermissionDto);
  }


  @ApiOperation({ summary: 'Delete permission by id', description: 'Delete permission by id' })
  @ApiResponse({ type: IdPermissionDto, status: 201 })
  @Delete(':id')
  async deletePermission(@Param('id') id: string): Promise<boolean> {
    return this.permissionService.deletePermission(id);
  }

}
