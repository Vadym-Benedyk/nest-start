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

  @ApiProperty({
    example: 'firstName',
    description:
      'search by field. Allowed values: firstName, lastName, email, age, createdAt',
  })
  @IsOptional()
  @IsString()
  @IsEnum(SearchFieldEnum)
  searchField: string;

  @ApiProperty({ example: 10, description: 'limit execute values' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;

  @ApiProperty({ example: 0, description: 'page number' })
  @IsOptional()
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiProperty({ example: 10, description: 'limit execute values on page' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize: number = 10;

  @ApiProperty({ example: 0, description: 'offset execute values' })
  @IsOptional()
  @IsInt()
  @Min(0)
  offset: number = 0;

  @ApiProperty({
    example: 'createdAt',
    description:
      'sort by field. Allowed values: firstName, lastName, email, age, createdAt',
  })
  @IsOptional()
  @IsString()
  @IsEnum(SortByEnum)
  sortBy: string = 'createdAt';

  @ApiProperty({
    example: 'ASC',
    description: 'sort direction. Allowed values: ASC, DESC',
  })
  @IsOptional()
  @IsString()
  @IsEnum(DirectionEnum)
  sortDirection: string = 'ASC';
}
