import { UserInterfaces } from '../../user/interfaces/user.interfaces';

export interface AuthenticationPayloadInterface {
  user: UserInterfaces;
  payload: {
    type: string;
    token: string;
    refreshToken?: string;
  };
}
