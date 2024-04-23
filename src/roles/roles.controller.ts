import { Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiResponseProperty,
} from '@nestjs/swagger';
import { RoleEntity } from './entities/role.entity';
import { GenericController } from 'src/common/decorators/controller.decorator';
import { QuerySortDto } from 'src/common/dto/query-sort.dto';
import { QueryRoleDto } from './dto/query-role.dto';
import { QueryPaginationDto } from 'src/common/dto/qyery-pagination.dto';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { infinityPagination } from 'src/utils/infinity-pagination';

@GenericController('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  /**
   * Create a new role
   * @param createRoleDto The role to be created
   * @returns The created role
   */
  @ApiOperation({ summary: 'Create a new role' })
  @ApiCreatedResponse({ description: 'The created role', type: RoleEntity })
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  /**
   * Retrieve all roles
   * @returns All roles
   */
  async findAll(
    @Query() queryRoleDto: QueryRoleDto,
    @Query() querySortDto: QuerySortDto<RoleEntity>,
    @Query() queryPaginationDto: QueryPaginationDto,
  ): Promise<InfinityPaginationResultType<RoleEntity>> {
    const page = queryPaginationDto?.page ?? 1;
    let limit = queryPaginationDto?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }
    return infinityPagination(
      await this.rolesService.findManyWithPagination({
        paginationOptions: { page, limit },
        filterOptions: queryRoleDto?.filters,
        sortOptions: querySortDto?.sort,
      }),
      { page, limit },
    );
  }
  /**
   * Retrieve a role by id
   * @param id The id of the role to be retrieved
   * @returns role with the given id
   */
  @ApiOperation({ summary: 'Retrieve a role by id' })
  @ApiResponseProperty({ type: RoleEntity })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

  /**
   * Update a role by id
   * @param id The id of the role to be updated
   * @param updateRoleDto The updated role
   * @returns The updated role
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  /**
   * Remove a role by id
   * @param id The id of the role to be removed
   * @returns The removed role
   */
  @Delete(':id')
  softDelete(@Param('id') id: string) {
    return this.rolesService.softDelete(+id);
  }
}
