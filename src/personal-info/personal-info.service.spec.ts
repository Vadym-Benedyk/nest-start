import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { PersonalInfoService } from '@/src/personal-info/personal-info.service';
import { PersonalInfoModel } from '@/src/personal-info/models/personal-info.model';
import {
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AddUserInfoDto } from '@/src/personal-info/dto/addUserInfo.dto';
import { UserInfoDto } from '@/src/personal-info/dto/userInfo.dto';
import { StatusEnum } from '@/src/personal-info/interfaces/personal-info.interface';

const mockPersonalInfoModel = {
  findOne: jest.fn(),
  findByPk: jest.fn(),
  findAll: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
};

describe('PersonalInfoService', () => {
  let service: PersonalInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PersonalInfoService,
        {
          provide: getModelToken(PersonalInfoModel),
          useValue: mockPersonalInfoModel,
        },
      ],
    }).compile();

    service = module.get<PersonalInfoService>(PersonalInfoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('addUserInfo', () => {
    it('should throw ForbiddenException if user info already exists', async () => {
      mockPersonalInfoModel.findOne.mockResolvedValue({});

      await expect(
        service.addUserInfo({
          userId: '1',
          age: 25,
          status: StatusEnum.SINGLE,
          photo: 'url',
        } as AddUserInfoDto),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should create and return personal info', async () => {
      mockPersonalInfoModel.findOne.mockResolvedValue(null);
      mockPersonalInfoModel.create.mockResolvedValue({
        userId: '1',
        age: 25,
        status: 'active',
        photo: 'url',
      });

      await expect(
        service.addUserInfo({
          userId: '1',
          age: 25,
          status: StatusEnum.SINGLE,
          photo: 'url',
        } as AddUserInfoDto),
      ).resolves.toEqual({
        userId: '1',
        age: 25,
        status: 'active',
        photo: 'url',
      });
    });

    it('should throw InternalServerErrorException on creation failure', async () => {
      mockPersonalInfoModel.findOne.mockResolvedValue(null);
      mockPersonalInfoModel.create.mockRejectedValue(new Error('DB Error'));

      await expect(
        service.addUserInfo({
          userId: '1',
          age: 25,
          status: StatusEnum.SINGLE,
          photo: 'url',
        } as AddUserInfoDto),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('getUserInfo', () => {
    it('should return user info', async () => {
      mockPersonalInfoModel.findByPk.mockResolvedValue({ id: '1', age: 25 });
      await expect(service.getUserInfo('1')).resolves.toEqual({
        id: '1',
        age: 25,
      });
    });

    it('should throw NotFoundException if user info does not exist', async () => {
      mockPersonalInfoModel.findByPk.mockResolvedValue(null);
      await expect(service.getUserInfo('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAllUsersInfo', () => {
    it('should return all user info', async () => {
      mockPersonalInfoModel.findAll.mockResolvedValue([{ id: '1', age: 25 }]);
      await expect(service.getAllUsersInfo()).resolves.toEqual([
        { id: '1', age: 25 },
      ]);
    });

    it('should throw NotFoundException if no data exists', async () => {
      mockPersonalInfoModel.findAll.mockResolvedValue([]); // порожній масив
      await expect(service.getAllUsersInfo()).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateUserInfo', () => {
    it('should update user info', async () => {
      mockPersonalInfoModel.findByPk.mockResolvedValue({ id: '1', age: 25 });
      mockPersonalInfoModel.update.mockResolvedValue([1]);
      mockPersonalInfoModel.findByPk.mockResolvedValue({ id: '1', age: 30 });

      await expect(
        service.updateUserInfo({ id: '1', age: 30 } as UserInfoDto),
      ).resolves.toEqual({ updates: 1, userInfo: { id: '1', age: 30 } });
    });

    it('should throw NotFoundException if user info does not exist', async () => {
      mockPersonalInfoModel.findByPk.mockResolvedValue(null);
      await expect(
        service.updateUserInfo({ id: '1', age: 30 } as UserInfoDto),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
