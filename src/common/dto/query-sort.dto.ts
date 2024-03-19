import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type, plainToInstance } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';

export class SortDto<T> {
  @ApiProperty()
  @IsString()
  orderBy: keyof T;

  @ApiProperty()
  @IsString()
  order: string;
}

export class QuerySortDto<T> {
  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @Transform(({ value }) => {
    return value ? plainToInstance(SortDto, JSON.parse(value)) : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => SortDto<T>)
  sort?: SortDto<T>[] | null;
}
