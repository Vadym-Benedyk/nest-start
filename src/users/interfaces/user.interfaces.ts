import { HttpStatus } from '@nestjs/common';


export interface UserInterfaces {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithoutPasswordInterfaces {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserListInterfaces {
  data?: UserInterfaces[];
  meta?: {
    totalItems?: number;
    totalPages?: number;
    currentPage?: number;
    itemsOnPage?: number;
  };
}

export interface UpdateUserInterface {
  updates: number;
  user: UserInterfaces;
}

export interface LogOutInterface {
  status: HttpStatus;
  message: string;
}