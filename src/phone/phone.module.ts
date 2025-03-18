import { Module } from '@nestjs/common';
import { Phone } from './phone';
import { PhoneService } from './phone.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { PhoneModel } from '@/src/phone/models/phone.model';
import { UserModule } from '@/src/users/user.module';
import { PhoneController } from '@/src/phone/phone.controller';

@Module({
  imports: [SequelizeModule.forFeature([PhoneModel]), UserModule],
  controllers: [PhoneController],
  providers: [Phone, PhoneService],
  exports: [PhoneService],
})
export class PhoneModule {}
