import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateRoleDto } from './create-role.dto';
import { IsNumber } from 'class-validator';

export class RoleDto extends PartialType(CreateRoleDto) {
  @ApiProperty()
  @IsNumber()
  id: number;
}
