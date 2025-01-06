import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { UserInterface } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserInterface> {
    const { firstName, lastName, email, password } = createUserDto;
    return this.userModel.create({ firstName, lastName, email, password });
  }

  async getAllUsers(): Promise<UserInterface[]> {
    return this.userModel.findAll();
  }

  async getUserById(id: number): Promise<UserInterface> {
    return this.userModel.findByPk(id);
  }

  async deleteUser(id: number): Promise<void> {
    const user = await this.userModel.findByPk(id);
    if (user) {
      await user.destroy();
    }
  }

  // async updateUser(
  //   id: UserInterface['id'],
  //   user: UserInterface,
  // ): Promise<[affectedCount: number, affectedRows: User[]]> {
  //   return this.userModel.update(id, user);
  // }
}
