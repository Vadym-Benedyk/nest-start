import {
  Injectable,
  NotFoundException,
  Query,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import {
  UserInterfaces,
  UserListInterfaces,
} from './interfaces/user.interfaces';
import { UserDto } from './dto/user.dto';
import { GetUsersDto } from './dto/get-users.dto';
import { Op } from 'sequelize';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserInterfaces> {
    const { firstName, lastName, email, password } = createUserDto;
    return this.userModel.create({
      firstName,
      lastName,
      email,
      password,
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
    const user = await this.userModel.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException(`User with email ${email} not found`);
    }
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.userModel.findByPk(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await user.destroy();
  }

  async updateUser(updateUserDto: UpdateUserDto): Promise<any> {
    const isUser = await this.userModel.findByPk(updateUserDto.id);
    if (!isUser) {
      throw new NotFoundException('Error by editing. User not found');
    }
    const { id, ...user } = updateUserDto;
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
