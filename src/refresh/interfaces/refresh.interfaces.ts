export interface PayloadUserInterface {
  user: UserInterface;
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

interface UserInterface {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}