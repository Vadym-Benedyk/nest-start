import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RolePermissionsModel } from '@/src/role-permissions/models/role-permissions.model';
import { RoleModel } from '@/src/role/models/role.model';
import { RoleService } from '@/src/role/role.service';
import { PermissionService } from '@/src/permission/permission.service';
import { RoleInterface } from '@/src/role/interfaces/role.interfaces';
import { PermissionModel } from '@/src/permission/models/permission.model';
import { AddPermissionToRoleDto } from '@/src/role-permissions/dto/add-permission-to-role.dto';



@Injectable()
export class RolePermissionsService {
  private readonly logger = new Logger(RolePermissionsService.name);

  constructor(
    @InjectModel(RolePermissionsModel)
    private readonly rolePermissionsModel: typeof RolePermissionsModel,
    @InjectModel(RoleModel)
    private readonly roleModel: typeof RoleModel,
    @InjectModel(PermissionModel)
    private readonly permissionModel: typeof PermissionModel,
    @Inject(forwardRef(() => RoleService))
    private readonly role: RoleService,
    @Inject(forwardRef(() => PermissionService))
    private readonly permission: PermissionService
  ) {}

  async getRolesWithPermissionId(permissionId: string): Promise<RoleInterface[]> {
    try {
      return await this.roleModel.findAll({
      include: {
        model: PermissionModel,
          where: { id: permissionId },
        through: { attributes: [] },
      }
      });
    } catch (error) {
      this.logger.error('Error by getting roles with permission id', error);
      throw error;
    }
  }


  async addPermissionToRole(addPermissionToRoleDto: AddPermissionToRoleDto): Promise<any> {
      const role = await this.role.checkRoleById(addPermissionToRoleDto.roleId);

      if (!role) {
        throw new Error('Role not found');
      }
      const permission = await this.permission.checkPermissionById(addPermissionToRoleDto.permissionId);
      if (!permission) {
        throw new Error('Permission not found');
      }

      const checkExist = await this.checkRolePermission(addPermissionToRoleDto);
      if (checkExist) {
        this.logger.error('Role has already this permission');
        throw new Error('Permission already added to role');
      }

      try {
        const rolePermission = await this.rolePermissionsModel.create({
          roleId: addPermissionToRoleDto.roleId,
          permissionId: addPermissionToRoleDto.permissionId,
        });
        if (!rolePermission) {
          this.logger.error('Error by saving permission to role');
        }

        this.logger.log('Permission added to role successfully');
        return { message: 'Permission added to role successfully' };

      } catch (error) {
        this.logger.error('Error by saving permission to role', error);
        throw error;
      }

  }


  async checkRolePermission(addPermissionToRoleDto: AddPermissionToRoleDto): Promise<boolean> {
    const rolePermission = await this.rolePermissionsModel.findOne({
      where: {
        roleId: addPermissionToRoleDto.roleId,
        permissionId: addPermissionToRoleDto.permissionId,
      },
    });
    return !!rolePermission;
  }


  async deletePermissionFromRole(roleId: string, permissionId: string): Promise<any> {
    const roleIdCheck = await this.rolePermissionsModel.findOne({ where: {roleId: roleId} })
    if (!roleIdCheck) {
      this.logger.error('Role not found when trying to delete permission');
      throw new Error('Role not found when trying to delete permission');
    }

    const permissionIdCheck = await this.rolePermissionsModel.findOne({ where: {permissionId: permissionId} })
    if (!permissionIdCheck) {
      this.logger.error('Permission not found when trying to delete permission');
      throw new Error('Permission not found when trying to delete permission');
    }

    try {
      await this.rolePermissionsModel.destroy({
        where: { roleId, permissionId },
      });
      this.logger.log('Permission removed from role successfully');
      return { message: 'Permission removed from role successfully' };
    } catch (error) {
      this.logger.error('Error by removing permission from role', error);
      throw error;
    }
  }
}
