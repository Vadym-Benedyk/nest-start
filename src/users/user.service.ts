import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import {UpdateUserInterface, UserInterfaces, UserListInterfaces} from './interfaces/user.interfaces';
import { GetUsersDto } from './dto/get-users.dto';
import { Op } from 'sequelize';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { hashPassword } from '@/src/auth/utility/hashPassword';


@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(@InjectModel(User) private readonly userModel: typeof User) {}


  async getAllUsers(): Promise<UserInterfaces[]> {
    try {
      return await this.userModel.findAll();
    } catch (error) {
      throw new HttpException('Problem with fetching all users from db', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }


  async checkUserById(userId: string): Promise<boolean> {
    return await this.userModel.count({ where: { id: userId } }) > 0;
  }


  async createUser(createUserDto: CreateUserDto): Promise<UserInterfaces> {
    const { firstName, lastName, email, password } = createUserDto;
    const hashedPassword = await hashPassword(password);

    try {
      const isUser = await this.userModel.count({ where: { email: email } });
      if (isUser > 0) {
        this.logger.warn(`User with ${email} is already register`);
        throw new HttpException(
          'This email is already register, please SignIn or use any else',
          HttpStatus.NOT_ACCEPTABLE,
        );
      }

      return await this.userModel.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });
    } catch (error) {
      this.logger.error(`Failed to create user: ${error}`);
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
      throw new NotFoundException(HttpStatus.NOT_FOUND);
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


  async updateUser(updateUserDto: UpdateUserDto): Promise<UpdateUserInterface> {
    const isUser = await this.userModel.findByPk(updateUserDto.id);
    if (!isUser) {
      throw new NotFoundException('Error by editing. User not found');
    }

    const { id, ...user } = updateUserDto;
    const [affectedRows] = await this.userModel.update(user, { where: { id } });
    const updatedUser = await this.userModel.findByPk(id);
    this.logger.log('User updated successfully');

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

    if (page && page >= 1 && pageSize > 0) {
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
