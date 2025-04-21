import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class IdDto {
  @IsUUID()
  @IsNotEmpty()
  @IsString()
  id: string;
}