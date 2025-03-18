import { Injectable, Logger, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { PhoneModel } from '@/src/phone/models/phone.model';
import { InjectModel } from '@nestjs/sequelize';
import { UserService } from '@/src/users/user.service';
import { PhoneDto } from '@/src/phone/dto/phone.dto';


@Injectable()
export class PhoneService {
  private readonly logger = new Logger(PhoneService.name);

  constructor(
    @InjectModel(PhoneModel)
    private readonly phoneModel: typeof PhoneModel,
    private readonly userService: UserService,
  ) {}


  async checkPhone(phone: string): Promise<any> {
    return await this.phoneModel.findOne({where: {phone}})
  }

  async getPhone(userId: string): Promise<any> {
    try {
      return await this.phoneModel.findOne({ where: { userId } });
    } catch (error) {
      throw new Error('Failed to read user phone from DB. Error: ' + error);
    }
  }

  async addPhone(phoneDto: PhoneDto): Promise<any> {
    const userExist = await this.userService.checkUserById(phoneDto.userId);
    if (!userExist) {
      throw new NotFoundException('User not found');
    }

    const phoneExist = await this.checkPhone(phoneDto.phone);
    if (phoneExist) {
      throw new NotAcceptableException('Phone already exist');
    }

    try {
      return await this.phoneModel.create({
        userId: phoneDto.userId,
        phone: phoneDto.phone,
      })
    } catch (error) {
      throw new Error('Failed to add user phone to DB. Error: ' + error);
    }
  }

  async updatePhone(phoneDto: PhoneDto): Promise<any> {
    const phoneRecord = await this.getPhone(phoneDto.userId);
    if (!phoneRecord) {
      throw new NotFoundException('User not found');
    }

    phoneRecord.phone = phoneDto.phone;
    await phoneRecord.save();

    return phoneRecord;
  }

  async deletePhone(userId: string): Promise<any> {
    try {
      return await this.phoneModel.destroy({ where: { userId } });
    } catch (error) {
      throw new Error('Failed to delete user phone from DB. Error: ' + error);
    }
  }


}
