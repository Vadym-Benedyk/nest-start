import {
  HttpException,
  HttpStatus,
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
  UserWithoutPasswordInterfaces,
} from './interfaces/user.interfaces';
import { GetUsersDto } from './dto/get-users.dto';
import { Op } from 'sequelize';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { hashPassword } from '@/src/auth/utility/hashPassword';
import { LoggerFacadeService } from '@/src/logger/logger-facade.service';
import { IdDto } from '@/src/users/dto/id.dto';
import { UpdatePasswordDto } from '@/src/users/dto/update-password.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    private readonly logger: LoggerFacadeService,
  ) {}

  async getAllUsers(): Promise<UserWithoutPasswordInterfaces[]> {
    try {
      const users = await this.userModel.findAll();

      return users.map((user) => {
        const { password, ...rest } = user.get({ plain: true });
        return rest;
      });
    } catch (error) {
      throw new HttpException(
        'Problem with fetching all users from db',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async checkUserById(userId: string): Promise<boolean> {
    return (await this.userModel.count({ where: { id: userId } })) > 0;
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserInterfaces> {
    const { firstName, lastName, email, password } = createUserDto;
    const hashedPassword = await hashPassword(password);

      const isUser = await this.userModel.count({ where: { email: email } });
      if (isUser > 0) {
        this.logger.warn(
          `User with ${email} is already register`,
          UserService.name,
        );
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
  }

  async validatePassword(userId: string, password: string): Promise<boolean> {
    try {
      const user = await this.userModel.findByPk(userId);
      return bcrypt.compareSync(password, user.password);
    } catch (error) {
      throw new UnauthorizedException('Invalid password', error);
    }
  }

  async getUserById(id: string): Promise<UserInterfaces> {
    try {
      const user = await this.userModel.findByPk(id);
      return user.dataValues;
    } catch (error) {
      this.logger.warn('User not found', UserService.name);
      throw new NotFoundException(HttpStatus.NOT_FOUND);
    }
  }

  async getUserByEmail(email: string): Promise<UserInterfaces> {
    try {
      const user = await this.userModel.findOne({ where: { email } });
      return user.dataValues;
    } catch (error) {
      this.logger.warn('User not found', UserService.name);
      throw new NotFoundException(HttpStatus.NOT_FOUND);
    }
  }

  async deleteUser(idDto: IdDto): Promise<void> {
    const user = await this.userModel.findByPk(idDto.id);
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
    this.logger.log('User updated successfully', UserService.name);

    return {
      updates: affectedRows,
      user: updatedUser,
    };
  }

  async updateUserPassword(updatePasswordDto: UpdatePasswordDto): Promise<UpdateUserInterface> {
    const { id, password } = updatePasswordDto;
    const isUser = await this.getUserById(id);
    if (!isUser) {
      this.logger.warn('Error by editing. User not found', UserService.name);
      throw new NotFoundException('Error by editing. User not found');
    }

    const [affectedRows] = await this.userModel.update({ password }, { where: { id } });
    const updatedUser = await this.userModel.findByPk(id);
    this.logger.log('User password updated successfully', UserService.name);

    return {
      updates: affectedRows,
      user: updatedUser,
    }
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
