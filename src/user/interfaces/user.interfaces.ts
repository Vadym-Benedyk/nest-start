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
  total?: number;
  totalPages?: number;
  data?: UserInterfaces[];
  page?: number;
  pageSize?: number;
}