import { UserInterfaces } from '../../user/interfaces/user.interfaces';

export interface AuthenticationPayloadInterface {
  user: UserInterfaces;
  payload: {
    type: string;
    token: string;
    refreshToken?: string;
  };
}

export interface RefreshTokenInterface {
  id: string;
  refreshToken: string;
  userId: string;
  expires: Date;
  createdAt: Date;
  updatedAt: Date;
}
