import { UserInterfaces } from '../../user/interfaces/user.interfaces';

export interface PayloadUserInterface {
  user: UserInterfaces;
  payload: {
    type: string;
    token: string;
  };
}

export interface RefreshPayloadUserInterface {
  payload: PayloadUserInterface;
  refreshToken?: string;
}

export interface RefreshTokenInterface {
  id: string;
  refreshToken: string;
  userId: string;
  expires: Date;
  createdAt: Date;
  updatedAt: Date;
}
