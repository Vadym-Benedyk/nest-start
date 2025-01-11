import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  UserInterfaces,
  UserListInterfaces,
} from './interfaces/user.interfaces';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUsersDto } from './dto/get-users.dto';
import { Op } from 'sequelize';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserInterfaces> {
    const { firstName, lastName, email, password, age, role } = createUserDto;
    return this.userModel.create({
      firstName,
      lastName,
      email,
      password,
      age,
      role,
    });
  }

  async getAllUsers(): Promise<UserInterfaces[]> {
    return this.userModel.findAll();
  }

  async getUserById(id: string): Promise<UserInterfaces> {
    return this.userModel.findByPk(id);
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.userModel.findByPk(id);
    if (user) {
      await user.destroy();
    }
  }

  async updateUser(data: UpdateUserDto): Promise<User> {
    const { id, ...user } = data;
    await this.userModel.update(user, { where: { id } });

    return await this.userModel.findByPk(id);
  }

  async getUsers(queryParams: GetUsersDto): Promise<UserListInterfaces> {
    const {
      search,
      searchField,
      offset,
      limit,
      page,
      pageSize,
      sortBy,
      sortDirection,
    } = queryParams;

    const where: any = {};
    if (search && searchField) {
      where[searchField] = {
        [Op.iLike]: `%${search}%`,
      };
    }
    let order = [];
    // let limit =
    if (sortDirection || sortBy) {
      order = [[sortBy || 'createdAt', sortDirection || 'ASC']];
    }
    // if(page && pageSize) {
    //    limit = ( page - 1 ) * pageSize;
    // }


    try {
      const users = await this.userModel.findAndCountAll({
        where,
        limit,
        offset,
        order,
      });

      // if (users) {
      //
      //
      // }

      return {
        data: users.rows,
        meta: {
          total: users.count,
          totalPages: Math.ceil(users.count / pageSize),
          page,
          pageSize,
        },
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users');
    }
  }
}
