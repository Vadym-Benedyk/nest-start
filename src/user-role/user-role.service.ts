import { forwardRef, HttpException, HttpStatus, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { RoleModel } from '@/src/role/models/role.model';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@/src/users/models/user.model';
import { UserRoleModel } from '@/src/user-role/models/user-role.model';
import { RoleService } from '@/src/role/role.service';
import { CreateRoleDto } from '@/src/role/dto/createRole.dto';
import { UsersInRoleInterface, UserWithRolesInterface } from '@/src/user-role/interfaces/user-role.interface';
import { UserService } from '@/src/users/user.service';
import { UserRoleDto } from '@/src/user-role/dto/user-role.dto';
import { RoleInterface } from '@/src/role/interfaces/role.interfaces';


@Injectable()
export class UserRoleService {
  private readonly logger = new Logger(UserRoleService.name)

  constructor(
    @InjectModel(UserRoleModel)
    private readonly userRoleModel: typeof UserRoleModel,
    @InjectModel(User)
    private readonly userModel: typeof User,
    @InjectModel(RoleModel)
    private readonly roleModel: typeof RoleModel,
    @Inject(forwardRef(() => UserService))
    private readonly user: UserService,
    @Inject(forwardRef(() => RoleService))
    private readonly role: RoleService
  ) {}

  async addDefaultRoleToUser(id: string): Promise<any> {
    const createRole: CreateRoleDto = { role: 'legionary' };
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

  async getUsersWithRole(id: string): Promise<UsersInRoleInterface> {
    const isRole = await this.roleModel.findOne({
      where: { id },
      include: { model: User, through: { attributes: [] } }
    })

    if (!isRole) {
      throw new NotFoundException(`Role with id ${id} not found`);
    }

    return {
      roleId: isRole.id,
      role: isRole.role,
      users: isRole.users.map(user => ({ userId: user.id, email: user.email }))
    }
  }

  async getUserRoles(id: string): Promise<RoleInterface[]> {
    const userWithRoles = await this.userModel.findOne({
      where: { id },
      include: { model: RoleModel, through: { attributes: [] } },
    });

    if (!userWithRoles) {
      throw new NotFoundException('User not found');
    }

    return userWithRoles.roles.map(role => role.dataValues);
  }

  async getUserWithRoles(id: string): Promise<any> {
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

  async addNewRoleToUser(userRoleDto: UserRoleDto): Promise<any> {
    const user: boolean = await this.user.checkUserById(userRoleDto.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const role: any = await this.role.checkRoleById(userRoleDto.roleId);
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    this.logger.log(`Adding role ${userRoleDto.roleId} to user ${userRoleDto.userId}`);

    const exists = await this.userRoleModel.findOne({
      where: { userId: userRoleDto.userId, roleId: userRoleDto.roleId },
    });

    if (exists) {
      this.logger.error('User already has this role');
      throw new HttpException('User already has this role', HttpStatus.BAD_REQUEST);
    }

    if (!exists && user && role) {
      await this.userRoleModel.create({
        userId: userRoleDto.userId,
        roleId: userRoleDto.roleId,
      });
    } else {
      this.logger.error('There is a problem by saving user role to db', UserRoleService.name);
      throw new NotFoundException('User or role not found');
    }

    this.logger.log(`Role added to user successfully`);
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

