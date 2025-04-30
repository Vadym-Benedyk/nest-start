import { HttpStatus, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { PhoneModel } from '@/src/phone/models/phone.model';
import { InjectModel } from '@nestjs/sequelize';
import { UserService } from '@/src/users/user.service';
import { PhoneDto } from '@/src/phone/dto/phone.dto';
import { PhoneInterfaces, ResponseStatusInterface } from '@/src/phone/interfaces/phone.interfaces';
import { UpdatePhoneDto } from '@/src/phone/dto/update-phone.dto';
import { SmsService } from '@/src/sms/sms.service';
import { VerifyPhoneDto } from '@/src/sms/dto/verifyPhone.dto';
import { VerifyOtpInterface } from '@/src/sms/interfaces/verify.interface';
import { LoggerFacadeService } from '@/src/logger/logger-facade.service';


@Injectable()
export class PhoneService {

  constructor(
    @InjectModel(PhoneModel)
    private readonly phoneModel: typeof PhoneModel,
    private readonly userService: UserService,
    private readonly smsService: SmsService,
    private readonly logger: LoggerFacadeService
  ) {}


  async checkPhone(phone: string): Promise<PhoneInterfaces> {
    return await this.phoneModel.findOne({where: {phone}})
  }

  async getPhone(userId: string): Promise<any> {
    const user = await this.userService.checkUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
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

  async updatePhone(updatePhoneDto: UpdatePhoneDto): Promise<PhoneInterfaces> {
    const [updated] = await this.phoneModel.update(
      { phone: updatePhoneDto.newPhone, verified: false },
      { where: { userId: updatePhoneDto.userId, phone: updatePhoneDto.phone } }
    );

    if (updated === 0) {
      throw new NotFoundException('User not found');
    }

    return await this.getPhone(updatePhoneDto.userId);
  }

  async deletePhone(userId: string, phone: string): Promise<ResponseStatusInterface> {
      const deleted = await this.phoneModel.destroy({ where: { userId, phone } });
      if(!deleted) {
        throw new NotFoundException('User not found');
      }
    return {
      message: 'Phone deleted successfully.',
    };
  }

  async verifyPhone(phoneDto: PhoneDto): Promise<any> {
    const user = await this.phoneModel.findOne({where: {phone: phoneDto.phone, userId: phoneDto.userId}})
    if (!user) {
      throw new NotFoundException('User with current phone not found');
    }
    this.logger.log('Ask verify phone', PhoneService.name);

    return await this.smsService.createVerification(phoneDto)
  }

  async getVerifiedPhone(verifyPhoneDto: VerifyPhoneDto): Promise<VerifyOtpInterface> {

    const verified = await this.smsService.createVerificationCheck(verifyPhoneDto);
    if (verified.status === HttpStatus.OK) {
      const user = await this.phoneModel.findOne({
        where: {
          phone: verifyPhoneDto.phone,
          userId: verifyPhoneDto.userId
        }
      })
      user.verified = true;
      await user.save();
      this.logger.log('Phone verified', PhoneService.name);
      return {
        status: HttpStatus.OK,
        message: 'Phone verified successfully.',
      };
    }
  }
}
