import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { UserInterface } from './interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async createUser(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ): Promise<UserInterface> {
    return this.userModel.create({ firstName, lastName, email, password });
  }

  async getAllUsers(): Promise<User[]> {
    return this.userModel.findAll();
  }

  async getUserById(id: number): Promise<User> {
    return this.userModel.findByPk(id);
  }
}
