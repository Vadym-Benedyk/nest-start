export interface PersonalInfoInterface {
  id: string;
  userId: string;
  age: number;
  status: string;
  photo: string;
}

export interface UpdateInfoResponseInterface {
  updates: number;
  userInfo: PersonalInfoInterface;
}


export enum StatusEnum {
  SINGLE = 'single',
  MARRIED = 'married',
  DIVORCED = 'divorced',
  WIDOWED = 'widowed',
  SEPARATED = 'separated',
  CIVIL_UNION = 'civil_union',
  OTHER = 'other',
}
