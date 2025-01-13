import { UserRole } from './role.enum';

export interface UserInterfaces {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  age: number;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
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
