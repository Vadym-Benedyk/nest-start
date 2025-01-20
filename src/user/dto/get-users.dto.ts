import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { DirectionEnum } from '../interfaces/direction.enum';
import { SortByEnum } from '../interfaces/sortBy.enum';
import { SearchFieldEnum } from '../interfaces/searchField.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class GetUsersDto {
  @ApiPropertyOptional({ example: 'John', description: 'search' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    example: 'firstName',
    description:
      'search by field. Allowed values: firstName, lastName, email, createdAt',
  })
  @IsOptional()
  @IsString()
  @IsEnum(SearchFieldEnum)
  searchField?: string;

  @ApiPropertyOptional({ example: 1, description: 'number of selected page' })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    example: 10,
    description: 'limit execute values on page',
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number = 10;

  @ApiPropertyOptional({
    example: 'createdAt',
    description:
      'sort by field. Allowed values: firstName, lastName, email, createdAt',
  })
  @IsOptional()
  @IsString()
  @IsEnum(SortByEnum)
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({
    example: 'ASC',
    description: 'sort direction. Allowed values: ASC, DESC',
  })
  @IsOptional()
  @IsString()
  @IsEnum(DirectionEnum)
  sortDirection?: string = 'ASC';
}
