export interface PayloadUserInterface {
  user: UserSecureInterface;
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

interface UserSecureInterface {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}