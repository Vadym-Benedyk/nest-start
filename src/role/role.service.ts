import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { RoleModel } from '@/src/role/models/role.model';
import { RoleInterface} from '@/src/role/interfaces/role.interfaces';
import { InjectModel } from '@nestjs/sequelize';
import { CreateRoleDto } from '@/src/role/dto/createRole.dto';
import { PermissionModel } from '@/src/permission/models/permission.model';


@Injectable()
export class RoleService {
  private readonly logger = new Logger(RoleService.name);

  constructor(
    @InjectModel(RoleModel)
    private readonly roleModel: typeof RoleModel
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

  async getRoleByName(createRoleDto: CreateRoleDto): Promise<RoleInterface> {
    try {
      return await this.roleModel.findOne({
        where: { role: createRoleDto.role },
      });
    } catch (error) {
      throw new InternalServerErrorException('Database query failed');
    }
  }

  async checkRoleById(id: string): Promise<boolean> {
    return await this.roleModel.count({ where: { id: id } }) > 0;
  }

  async getRoleByPK(id: string): Promise<RoleInterface> {
    try {
      const role = await this.roleModel.findByPk(id, { include: PermissionModel });
    console.log('ROLE_PERMISSIONS', role?.permissions);
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

  async createRole(createRoleDto: CreateRoleDto): Promise<RoleInterface> {
    const isRole = await this.getRoleByName(createRoleDto);
    if (isRole) {
      throw new HttpException(
        `'${createRoleDto.role.toUpperCase()}' is already present in database`,
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

}
