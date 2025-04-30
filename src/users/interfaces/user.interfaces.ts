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

export interface UserSecureInterfaces {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserListInterfaces {
  data?: UserSecureInterfaces[];
  meta?: {
    totalItems?: number;
    totalPages?: number;
    currentPage?: number;
    itemsOnPage?: number;
  };
}

export interface UpdateUserInterface {
  updates: number;
  user: UserSecureInterfaces;
}

export interface LogOutInterface {
  status: HttpStatus;
  message: string;
}