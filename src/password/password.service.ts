import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PasswordModel } from './models/password.model';
import { CreatePasswordDto } from './dto/create-password.dto';
import { CreatePasswordInterface } from './interfaces/createPassword.interface';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class PasswordService {
  constructor(
    @InjectModel(PasswordModel) private passwordModel: typeof PasswordModel,
  ) {}

  // Hash the password
  public async hashPassword(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, 10);
    } catch (error) {
      throw new Error('Failed to hash password: ' + error);
    }
  }

  async createPassword(
    createPasswordDto: CreatePasswordDto,
  ): Promise<CreatePasswordInterface> {
    const { password, userId } = createPasswordDto;

    try {
      const hashedPassword = await this.hashPassword(password);
      return await this.passwordModel.create({
        password: hashedPassword,
        userId: userId,
      });
    } catch (error) {
      throw new Error('Failed to create password. Error: ' + error);
    }
  }

  //return number of updated rows!!!
  async updatePassword(
    createPasswordDto: CreatePasswordDto,
  ): Promise<[number]> {
    const { password, userId } = createPasswordDto;
    try {
      const hashedPassword = await this.hashPassword(password);
      return await this.passwordModel.update(
        { password: hashedPassword },
        { where: { userId: userId } },
      );
    } catch (error) {
      throw new Error('Failed to update password. Error: ' + error);
    }
  }

  //validate Password
  async validatePassword(userId: string, password: string): Promise<boolean> {
    try {
      const savedPassword = await this.passwordModel.findOne({
        where: { userId: userId },
      });
      if (!savedPassword) {
        throw new UnauthorizedException('Password not found');
      }

      const isMatch = bcrypt.compareSync(password, savedPassword.password);
      if (!isMatch) {
        throw new UnauthorizedException('Invalid password');
      }

      return isMatch;
    } catch (error) {
      throw error instanceof UnauthorizedException
        ? error
        : new Error('Failed to validate password. Error: ' + error);
    }
  }
}
