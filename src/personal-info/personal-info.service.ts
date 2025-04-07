import {
  ForbiddenException,Injectable, InternalServerErrorException, NotFoundException} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AddUserInfoDto } from '@/src/personal-info/dto/addUserInfo.dto';
import { PersonalInfoModel } from '@/src/personal-info/models/personal-info.model';
import { PersonalInfoInterface, UpdateInfoResponseInterface } from '@/src/personal-info/interfaces/personal-info.interface';
import { UserInfoDto } from '@/src/personal-info/dto/userInfo.dto';
import { UserService } from '@/src/users/user.service';
import { LoggerFacadeService } from '@/src/logger/logger-facade.service';



@Injectable()
export class PersonalInfoService {
  constructor(
    @InjectModel(PersonalInfoModel)
    private readonly personalInfoModel: typeof PersonalInfoModel,
    private readonly userService: UserService,
    private readonly logger: LoggerFacadeService
  ) {}

  async addUserInfo(
    addUserInfoDto: AddUserInfoDto,
  ): Promise<PersonalInfoInterface> {
      const existUser = await this.userService.checkUserById(addUserInfoDto.userId);

      if (!existUser) {
        this.logger.error('Error by adding user info. User ID from request not found', PersonalInfoService.name);
        throw new NotFoundException('User ID from request body object not found');
      }

      const isInfo = await this.personalInfoModel.findOne({ where: { userId: addUserInfoDto.userId } });

      if (isInfo) {
        this.logger.error('Error by adding user info. Info for this user already exists', PersonalInfoService.name);
        throw new ForbiddenException('User info already exists');
      }


      return await this.personalInfoModel.create({
        userId: addUserInfoDto.userId,
        age: addUserInfoDto.age,
        status: addUserInfoDto.status,
        photo: addUserInfoDto.photo,
      });
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

      if (allInfo.length === 0) {
        throw new NotFoundException('No users found');
      }

      return allInfo;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException('Database query failed');
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
