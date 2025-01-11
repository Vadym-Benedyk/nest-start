import { UserRole } from './role.enum';

export interface UserInterfaces {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  age: number;
  role: UserRole;
}
