import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { UserInterfaces } from './interfaces/user.interfaces';
import { CreateUserDto } from './dto/create-user.dto';

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

  async getUserById(id: number): Promise<UserInterfaces> {
    return this.userModel.findByPk(id);
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.userModel.findByPk(id);
    if (user) {
      await user.destroy();
    }
  }

  // async updateUser(
  //   id: UserInterfaces['id'],
  //   user: UserInterfaces,
  // ): Promise<[affectedCount: number, affectedRows: User[]]> {
  //   return this.userModel.update(id, user);
  // }
}
