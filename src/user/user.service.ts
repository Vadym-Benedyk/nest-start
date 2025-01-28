import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import {
  UpdateUserInterface,
  UserInterfaces,
  UserListInterfaces,
} from './interfaces/user.interfaces';
import { GetUsersDto } from './dto/request/get-users.dto';
import { Op } from 'sequelize';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { PasswordService } from '../password/password.service';
import { UserRoleDto } from './dto/request/user-role.dto';
import { UserDto } from './dto/request/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    private readonly password: PasswordService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserInterfaces> {
    const { firstName, lastName, email, password } = createUserDto;

    try {
      const saveUser = await this.userModel.create({
        firstName,
        lastName,
        email,
      });
      const savePassword = await this.password.createPassword({
        password,
        userId: saveUser.id,
      });

      if (!saveUser || !savePassword) {
        return null;
      }

      return saveUser;
    } catch (error) {
      throw new Error('Failed to create user: ' + error);
    }
  }

  async getUserById(id: string): Promise<UserInterfaces> {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<UserInterfaces> {
    return await this.userModel.findOne({ where: { email } });
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await user.destroy();
  }

  async updateRole(userRoleDto: UserRoleDto): Promise<UpdateUserInterface> {
    const { UserId, role } = userRoleDto;
    try {
      const isUser = await this.userModel.findByPk(UserId);
      if (!isUser) {
        throw new NotFoundException('Error by editing. User not found');
      }
      const [affectedRows] = await this.userModel.update(
        { role },
        { where: { id: UserId } },
      );
      const updatedUser = await this.userModel.findByPk(UserId);

      return {
        updates: affectedRows,
        user: updatedUser,
      };
    } catch (error) {
      throw new Error('Failed to update role. Error: ' + error);
    }
  }

  async updateUser(userDto: UserDto): Promise<UpdateUserInterface> {
    const isUser = await this.userModel.findByPk(userDto.id);
    if (!isUser) {
      throw new NotFoundException('Error by editing. User not found');
    }

    const { id, ...user } = userDto;
    const [affectedRows] = await this.userModel.update(user, { where: { id } });
    const updatedUser = await this.userModel.findByPk(id);

    return {
      updates: affectedRows,
      user: updatedUser,
    };
  }

  async getUsers(
    @Query() queryParams: GetUsersDto,
  ): Promise<UserListInterfaces> {
    const { search, searchField, page, pageSize, sortBy, sortDirection } =
      queryParams;

    const where: any = {};
    if (search && searchField) {
      where[searchField] = {
        [Op.iLike]: `%${search}%`,
      };
    }
    let order = [];

    if (sortDirection || sortBy) {
      order = [[sortBy || 'createdAt', sortDirection || 'ASC']];
    }

    let limit = 10;
    let offset = 0;

    if (page && page >= 1 && pageSize) {
      limit = pageSize;
      offset = (page - 1) * pageSize;
    }

    try {
      const users = await this.userModel.findAndCountAll({
        where,
        limit,
        offset,
        order,
      });

      return {
        data: users.rows,
        meta: {
          totalItems: users.count,
          totalPages: Math.ceil(users.count / pageSize),
          currentPage: parseInt(String(page)),
          itemsOnPage: parseInt(String(pageSize)),
        },
      };
    } catch (error) {
      throw new Error('Failed to fetch users' + error);
    }
  }
}
