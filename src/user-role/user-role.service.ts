import { forwardRef, HttpException, HttpStatus, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { RoleModel } from '@/src/role/models/role.model';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@/src/users/models/user.model';
import { UserRoleModel } from '@/src/user-role/models/user-role.model';
import { RoleService } from '@/src/role/role.service';
import { CreateRoleDto } from '@/src/role/dto/createRole.dto';
import { UserRoleInterface, UserWithRolesInterface } from '@/src/user-role/interfaces/user-role.interface';
import { UserService } from '@/src/users/user.service';
import { UserRoleDto } from '@/src/user-role/dto/user-role.dto';



@Injectable()
export class UserRoleService {
  private readonly logger = new Logger(UserRoleService.name)

  constructor(
    @InjectModel(UserRoleModel)
    private readonly userRoleModel: typeof UserRoleModel,
    @InjectModel(User)
    private readonly userModel: typeof User,
    @Inject(forwardRef(() => UserService))
    private readonly user: UserService,
    @Inject(forwardRef(() => RoleService))
    private readonly role: RoleService
  ) { }

  async addDefaultRoleToUser(id: string): Promise<UserRoleInterface> {
    const createRole: CreateRoleDto = { role: 'user' };
    const defaultRole = await this.role.getRoleByName( createRole );
    try {
        const userRoleInstance: UserRoleModel = await this.userRoleModel.create({
          userId: id,
          roleId: defaultRole.id
         })
        return userRoleInstance.toJSON()
    } catch (error) {
      this.logger.error('Error by adding default role to user', error)
    }
  }

  async getUserWithRoles(id: string): Promise<UserWithRolesInterface> {
    const userWithRoles = await this.userModel.findOne({
      where: { id },
      include: { model: RoleModel, through: { attributes: [] } },
    });

    if (!userWithRoles) {
      throw new NotFoundException('User not found');
    }

    return {
      ...userWithRoles.dataValues,
      roles: userWithRoles.roles.map(role => role.role)
    }
  }

  async addNewRoleToUser(userRoleDto: UserRoleDto): Promise<UserWithRolesInterface> {
    const user: boolean = await this.user.checkUserById(userRoleDto.userId);
    const role: boolean = await this.role.checkRoleById(userRoleDto.roleId);

    const exists = await this.userRoleModel.findOne({
      where: { userId: userRoleDto.userId, roleId: userRoleDto.roleId },
    });

    if (!exists && user && role) {
      await this.userRoleModel.create({
        userId: userRoleDto.userId,
        roleId: userRoleDto.roleId,
      });
    } else {
      this.logger.error('User or role not found');
      throw new NotFoundException('User or role not found');
    }

    this.logger.log('User role added successfully');
    return await this.getUserWithRoles(userRoleDto.userId)
  }

  async removeRole(userId: string, roleId: string): Promise<UserWithRolesInterface> {
    try {
      if (!(await this.user.checkUserById(userId))) {
        throw new NotFoundException('User not found');
      }

      if (!(await this.role.checkRoleById(roleId))) {
        throw new NotFoundException('Role not found');
      }

      const deletedCount = await this.userRoleModel.destroy({
        where: { userId, roleId },
      });

      if (!deletedCount) {
        throw new NotFoundException('Role not assigned to user');
      }

      this.logger.log(`Role ${roleId} removed from user ${userId}`);
      return await this.getUserWithRoles(userId);

    } catch (error) {
      this.logger.error(`Failed to remove role ${roleId} from user ${userId}`, error);
      throw new HttpException('Failed to remove role from user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

