import { IsNotEmpty, IsUUID } from 'class-validator';

export class IdDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}