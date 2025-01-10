import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { DirectionEnum } from '../interfaces/direction.enum';
import { SortByEnum } from '../interfaces/sortBy.enum';
import { SearchFieldEnum } from '../interfaces/searchField.enum';

export class GetUsersDto {
  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  @IsString()
  @IsEnum(SearchFieldEnum)
  searchField: string;

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
  @IsEnum(SortByEnum)
  sortBy: string = 'createdAt';

  @IsOptional()
  @IsString()
  @IsEnum(DirectionEnum)
  sortDirection: string = 'ASC';
}
