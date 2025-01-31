import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AddUserInfoDto } from '@/src/personal-info/dto/request/addUserInfo.dto';
import { PersonalInfoModel } from '@/src/personal-info/models/personal-info.model';
import {
  PersonalInfoInterface,
  UpdateInfoResponseInterface,
} from '@/src/personal-info/interfaces/personal-info.interface';
import { UserInfoDto } from '@/src/personal-info/dto/response/userInfo.dto';

@Injectable()
export class PersonalInfoService {
  constructor(
    @InjectModel(PersonalInfoModel)
    private readonly personalInfoModel: typeof PersonalInfoModel,
  ) {}

  async addUserInfo(
    addUserInfoDto: AddUserInfoDto,
  ): Promise<PersonalInfoInterface> {
    try {
      return await this.personalInfoModel.create({
        userId: addUserInfoDto.userId,
        age: addUserInfoDto.age,
        status: addUserInfoDto.status,
        photo: addUserInfoDto.photo,
      });
    } catch (error) {
      throw new Error('Failed to create user personal info', error);
    }
  }

  async getUserInfo(id: string): Promise<PersonalInfoInterface> {
    try {
      const info = await this.personalInfoModel.findByPk(id);
      if (!info) {
        throw new NotFoundException('No data found');
      }
      return info;
    } catch {
      throw new NotFoundException('Item not found in database');
    }
  }

  async getAllUsersInfo(): Promise<PersonalInfoInterface[]> {
    try {
      const allInfo = await this.personalInfoModel.findAll();
      if (!allInfo) {
        throw new NotFoundException();
      }
      return allInfo;
    } catch {
      throw new ForbiddenException();
    }
  }

  async updateUserInfo(
    userInfoDto: UserInfoDto,
  ): Promise<UpdateInfoResponseInterface> {
    const isUserInfo = await this.personalInfoModel.findByPk(userInfoDto.id);

    if (!isUserInfo) {
      throw new NotFoundException('No user info in database');
    }
    const { id, ...rest } = userInfoDto;

    const [affectedRows] = await this.personalInfoModel.update(rest, {
      where: { id },
    });
    const newInfo = await this.personalInfoModel.findByPk(id);

    return {
      updates: affectedRows,
      userInfo: newInfo,
    };
  }
}
