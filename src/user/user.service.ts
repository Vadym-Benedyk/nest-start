import {
  Injectable,
  NotFoundException,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
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
import { UserRoleDto } from './dto/request/user-role.dto';
import { UpdateUserDto } from './dto/request/update-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private readonly userModel: typeof User) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserInterfaces> {
    const { firstName, lastName, email, password } = createUserDto;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      return await this.userModel.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });
    } catch (error) {
      throw new Error('Failed to create user: ' + error);
    }
  }

  async validatePassword(userId: string, password: string): Promise<boolean> {
    try {
      const user = await this.getUserById(userId);
      return bcrypt.compareSync(password, user.password);
    } catch (error) {
      throw new UnauthorizedException('Invalid password', error);
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

  async updateUser(updateUserDto: UpdateUserDto): Promise<UpdateUserInterface> {
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
