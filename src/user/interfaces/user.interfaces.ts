import { UserRole } from './role.enum';

export interface UserInterfaces {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  age: number;
  role: UserRole;
}
