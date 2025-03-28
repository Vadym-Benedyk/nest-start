import { HttpStatus } from '@nestjs/common';

export interface CreateUserInterface {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateUserDataInterface {
  status: object;
  data?: CreateUserInterface;
}

export interface RefreshStatusInterface {
  status: HttpStatus,
  message: string
}