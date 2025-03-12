import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AddPermissionDto } from '@/src/permission/dto/add-permission.dto';
import { PermissionInterface } from '@/src/permission/interfaces/permission.interface';
import { PermissionModel } from '@/src/permission/models/permission.model';
import { RoleModel } from '@/src/role/models/role.model';
import { User } from '@/src/users/models/user.model';

@Injectable()
export class PermissionService {
  private readonly logger = new Logger(PermissionService.name);
  constructor(
    @InjectModel(PermissionModel)
    private readonly permissionModel: typeof PermissionModel,
    @InjectModel(RoleModel)
    private readonly roleModel: typeof RoleModel,
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async checkPermissionByName(permission: string): Promise<boolean> {
    const permissionExists = await this.permissionModel.findOne({
      where: { permission },
    });
    return !!permissionExists;
  }

  async checkPermissionById(id: string): Promise<boolean> {
    return (await this.permissionModel.count({ where: { id: id } })) > 0;
  }

  async createPermission(
    addPermissionDto: AddPermissionDto,
  ): Promise<PermissionInterface> {
    const { permission, description } = addPermissionDto;
    const permissionExists = await this.checkPermissionByName(permission);

    if (permissionExists) {
      throw new HttpException(
        'Permission already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      const newPermission = await this.permissionModel.create({
        permission,
        description,
      });
      if (newPermission) {
        this.logger.log(`Permission '${permission}' created successfully`);
        return newPermission.toJSON();
      }
    } catch (error) {
      throw new HttpException(
        'Detected a problem when permission saving ',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async getAllPermissions(): Promise<PermissionInterface[]> {
    try {
      return await this.permissionModel.findAll();
    } catch (error) {
      throw new HttpException(
        'Internal server error by getting all permissions',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getPermissionById(id: string): Promise<PermissionInterface> {
    const permission: PermissionInterface =
      await this.permissionModel.findByPk(id);
    if (!permission) {
      throw new HttpException('Permission not found', HttpStatus.NOT_FOUND);
    }
    return permission;
  }

  async deletePermission(id: string): Promise<boolean> {
    const permission: PermissionInterface =
      await this.permissionModel.findByPk(id);
    if (!permission) {
      throw new HttpException('Permission not found', HttpStatus.NOT_FOUND);
    }
    const result = await this.permissionModel.destroy({ where: { id } });
    if (result > 0) {
      this.logger.log(
        `Permission '${permission.permission}' deleted successfully`,
      );
      return true;
    } else {
      throw new HttpException(
        'Detected a problem when deleting permission',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async getPermissionsByUserId(userId: string): Promise<string[]> {
    const user = await this.userModel.findByPk(userId, {
      include: [
        {
          model: RoleModel,
          include: [
            { model: PermissionModel, through: { attributes: [] } }, // пермішени через ролі
          ],
        },
        // {
        //   model: PermissionModel, // індивідуальні пермішени
        //   through: { attributes: [] },
        // },
      ],
    });

    const userRoles = user.toJSON().roles;
    // Витягуємо всі permissions
    const allPermissions = userRoles.flatMap((role) =>
      role.permissions.map((p) => p.permission),
    );
    // Видаляємо дублікати
    return [...new Set(allPermissions)];

  }
}
