import { PartialType } from '@nestjs/mapped-types';

import { CreateRoleDto } from './create-role.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, ValidateNested } from 'class-validator';
import { Transform, Type, plainToInstance } from 'class-transformer';

export class FilterRoleDto extends PartialType(CreateRoleDto) {}

export class QueryRoleDto {
  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @Transform(({ value }) =>
    value ? plainToInstance(FilterRoleDto, JSON.parse(value)) : undefined,
  )
  @ValidateNested()
  @Type(() => FilterRoleDto)
  filters?: FilterRoleDto | null;
}
