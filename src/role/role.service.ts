import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { RoleModel } from '@/src/role/models/role.model';
import { RoleInterface, UpdateRoleInterface } from '@/src/role/interfaces/role.interfaces';
import { InjectModel } from '@nestjs/sequelize';
import { NameRoleDto } from '@/src/role/dto/name-role.dto';
import { UserRoleModel } from '@/src/role/models/user-role.model';
import * as process from 'node:process';
import { UpdateUserRoleDto } from '@/src/role/dto/update-user-role.dto';
import { UserService } from '@/src/users/user.service';



@Injectable()
export class RoleService {
  private readonly logger = new Logger(RoleService.name);

  constructor(
    @InjectModel(RoleModel)
    private readonly roleModel: typeof RoleModel,
    @InjectModel(UserRoleModel)
    private readonly userRoleModel: typeof UserRoleModel,
    private readonly userService: UserService,
  ) {}

  async getAllRoles(): Promise<RoleInterface[]> {
    try {
      const roles = await this.roleModel.findAll();
      if (roles && roles.length === 0) {
        throw new NotFoundException('No roles in database');
      }
      return roles;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Database query failed');
    }
  }

  async getRoleByName(createRoleDto: NameRoleDto): Promise<RoleInterface> {
    try {
      return await this.roleModel.findOne({
        where: { role: createRoleDto.role },
      });
    } catch (error) {
      throw new InternalServerErrorException('Database query failed');
    }
  }

  async getRoleByPK(id: string): Promise<RoleInterface> {

    try {
      const role = await this.roleModel.findByPk(id);
      if (role === null) {
        throw new NotFoundException('Role not found');
      }
      return role;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Database failed get role by id',
        );
      }
    }
  }

  async createRole(createRoleDto: NameRoleDto): Promise<RoleInterface> {
    const isRole = await this.getRoleByName(createRoleDto);
    if (isRole) {
      throw new HttpException(
        `${createRoleDto.role.toUpperCase()} is already present in database`,
        HttpStatus.CONFLICT,
      );
    }

    try {
      return await this.roleModel.create(createRoleDto.role);
    } catch (error) {
      throw new InternalServerErrorException('Database query failed');
    }
  }

  async deleteRole(id: string): Promise<void> {
    const isRole = await this.roleModel.findByPk(id);
    if (isRole === null) {
      throw new NotFoundException('Role with provided id not found');
    }

    try {
      await isRole.destroy();
    } catch (error) {
      throw new InternalServerErrorException('Error by destroying role');
    }
  }

  async addDefaultRoleToUser(id: string): Promise<void> {
    const defaultRole = await this.roleModel.findOne({ where: { role: process.env.USER_DEFAULT_ROLE }, rejectOnEmpty: true, });
    try {
      await this.userRoleModel.create({
        userId: id,
        roleId: defaultRole.id
      })
    } catch (error) {
      this.logger.error('Error by adding default role to user', error)
    }
  }

  async updateRole(updateRoleDto: UpdateUserRoleDto): Promise<any> {
    const { userId, role } = updateRoleDto;
    const userWithRoles = await this.userService.getUserWithRoles(userId);
    console.log(userWithRoles);
    return userWithRoles
  }
}
