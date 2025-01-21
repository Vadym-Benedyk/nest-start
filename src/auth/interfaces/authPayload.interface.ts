import { UserInterfaces } from '../../user/interfaces/user.interfaces';

export interface AuthPayloadInterfaces {
  user: UserInterfaces;
  payload: {
    type: string;
    token: string;
    refreshToken?: string;
  };
}
