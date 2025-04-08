import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RolePermissionsModel } from '@/src/role-permissions/models/role-permissions.model';
import { RoleModel } from '@/src/role/models/role.model';
import { RoleService } from '@/src/role/role.service';
import { PermissionService } from '@/src/permission/permission.service';
import { PermissionModel } from '@/src/permission/models/permission.model';
import { AddPermissionToRoleDto } from '@/src/role-permissions/dto/add-permission-to-role.dto';
import { RolePermissionInterface, RolesWithPermissionInterface } from '@/src/role-permissions/interfaces/role-permission.interfaces';
import { LoggerFacadeService } from '@/src/logger/logger-facade.service';



@Injectable()
export class RolePermissionsService {
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
    private readonly permission: PermissionService,
    private readonly logger: LoggerFacadeService,
  ) {}

  async getRolesWithPermissionId(permissionId: string): Promise<RolesWithPermissionInterface[]> {
    try {
      return await this.roleModel.findAll({
      include: {
        model: PermissionModel,
          where: { id: permissionId },
        through: { attributes: [] },
      }
      });
    } catch (error) {
      this.logger.error('Error by getting roles with current permission id', RolePermissionsService.name);
      throw error;
    }
  }


  async addPermissionToRole(addPermissionToRoleDto: AddPermissionToRoleDto): Promise<RolePermissionInterface> {
    const role = await this.role.checkRoleById(addPermissionToRoleDto.roleId);
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const permission = await this.permission.checkPermissionById(addPermissionToRoleDto.permissionId);
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    const checkExist = await this.checkRolePermission(addPermissionToRoleDto);
    if (checkExist) {
      this.logger.error(`Role ${addPermissionToRoleDto.roleId} already has permission ${addPermissionToRoleDto.permissionId}`, RolePermissionsService.name);
      throw new ConflictException('Permission already added to role');
    }

    try {
      const rolePermission = await this.rolePermissionsModel.create({
        roleId: addPermissionToRoleDto.roleId,
        permissionId: addPermissionToRoleDto.permissionId,
      });

      if (!rolePermission) {
        this.logger.error('Failed to save permission to role', RolePermissionsService.name);
        throw new InternalServerErrorException('Error saving permission to role');
      }

      this.logger.log(`Permission ${addPermissionToRoleDto.permissionId} added to role ${addPermissionToRoleDto.roleId} successfully`, RolePermissionsService.name);
      return rolePermission;
    } catch (error) {
      this.logger.error('Database error while saving permission to role', RolePermissionsService.name);
      throw new InternalServerErrorException('Database error: could not add permission to role');
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


  async getRolePermissions(roleId: string): Promise<RolesWithPermissionInterface> {
    const role = await this.roleModel.findOne({
      where: { id: roleId },
      include: [
        {
          model: PermissionModel,
          through: { attributes: [] },
        },
      ]
    });

    if (!role) {
      throw NotFoundException;
    }
    return role
  }


  async deletePermissionFromRole(roleId: string, permissionId: string): Promise<any> {
    const roleIdCheck = await this.rolePermissionsModel.findOne({ where: {roleId: roleId} })
    if (!roleIdCheck) {
      this.logger.error('Role not found when trying to delete permission', RolePermissionsService.name);
      throw new Error('Role not found when trying to delete permission');
    }

    const permissionIdCheck = await this.rolePermissionsModel.findOne({ where: {permissionId: permissionId} })
    if (!permissionIdCheck) {
      this.logger.error('Permission not found when trying to delete permission', RolePermissionsService.name);
      throw new Error('Permission not found when trying to delete permission');
    }

    try {
      await this.rolePermissionsModel.destroy({
        where: { roleId, permissionId },
      });
      this.logger.log('Permission removed from role successfully', RolePermissionsService.name);
      return { message: 'Permission removed from role successfully' };
    } catch (error) {
      this.logger.error('Error by removing permission from role', RolePermissionsService.name);
      throw error;
    }
  }
}
