import { MongoQuery, RawRuleOf } from '@casl/ability';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Action, Subject } from 'src/common/@types';
import { AppAbility } from 'src/utils/casl/casl-ability.factory';

export class PermissionsDto implements RawRuleOf<AppAbility> {
  @IsEnum(Action)
  action: Action | Action[];

  @IsEnum(Subject)
  subject: Subject | Subject[];

  @IsOptional()
  @IsString({ each: true })
  fields?: string | string[] | undefined;

  @IsOptional()
  conditions?: MongoQuery | undefined;

  @IsOptional()
  @IsBoolean()
  inverted?: boolean | undefined;

  @IsOptional()
  @IsString()
  reason?: string | undefined;
}

export class CreateRoleDto {
  @ApiProperty({
    example: 'Admin',
    description: 'The name of the role',
  })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({
    example: 'The admin role',
    description: 'The description of the role',
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    example: [{ actions: 'manage', subject: 'all' }],
    description: 'The permissions of the role',
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => PermissionsDto)
  permissions: RawRuleOf<AppAbility>[];
}
