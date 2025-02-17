import { UserRole } from '../../role/interfaces/role.enum';

export interface UserInterfaces {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
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

export interface UpdateUserInterface {
  updates: number;
  user: UserInterfaces;
}
