import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  UserInterfaces,
  UserListInterfaces,
} from './interfaces/user.interfaces';
import { UserDto } from './dto/user.dto';
import { GetUsersDto } from './dto/get-users.dto';
import { Op } from 'sequelize';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async createUser(createUserDto: UserDto): Promise<UserInterfaces> {
    const { firstName, lastName, email, password, role } = createUserDto;
    return this.userModel.create({
      firstName,
      lastName,
      email,
      password,
      role,
    });
  }

  async getAllUsers(): Promise<UserInterfaces[]> {
    return this.userModel.findAll();
  }

  async getUserById(id: string): Promise<UserInterfaces> {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<UserInterfaces> {
    return this.userModel.findOne({ where: { email } });
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await user.destroy();
  }

  async updateUser(data: UpdateUserDto): Promise<User> {
    const { id, ...user } = data;
    await this.userModel.update(user, { where: { id } });

    return await this.userModel.findByPk(id);
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
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users');
    }
  }
}
