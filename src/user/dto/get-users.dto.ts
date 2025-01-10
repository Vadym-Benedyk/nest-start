import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { DirectionEnum } from '../interfaces/direction.enum';
import { SortByEnum } from '../interfaces/sortBy.enum';
import { SearchFieldEnum } from '../interfaces/searchField.enum';
import { ApiProperty } from '@nestjs/swagger';

export class GetUsersDto {
  @ApiProperty({ example: 'John', description: 'search' })
  @IsOptional()
  @IsString()
  search: string;

  @ApiProperty({ example: 'firstName', description: 'search field. Allowed values: firstName, lastName, email, age, createdAt' })
  @IsOptional()
  @IsString()
  @IsEnum(SearchFieldEnum)
  searchField: string;

  @ApiProperty({ example: 10, description: 'page size' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize: number = 10;

  @ApiProperty({ example: 1, description: 'number of request page' })
  @IsOptional()
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiProperty({ example: 'firstName', description: 'sort by field. Allowed values: firstName, lastName, email, age, createdAt' })
  @IsOptional()
  @IsString()
  @IsEnum(SortByEnum)
  sortBy: string = 'createdAt';

  @ApiProperty({ example: 'ASC', description: 'sort direction. Allowed values: ASC, DESC' })
  @IsOptional()
  @IsString()
  @IsEnum(DirectionEnum)
  sortDirection: string = 'ASC';
}
