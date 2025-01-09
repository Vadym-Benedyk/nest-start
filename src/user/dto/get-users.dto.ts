import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class GetUsersDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;

  @IsOptional()
  @IsInt()
  @Min(0)
  offset: number = 0;

  @IsOptional()
  @IsString()
  sortBy: string = 'createdAt';

  @IsOptional()
  @IsString()
  sortDirection: 'asc' | 'desc' = 'asc';
}
