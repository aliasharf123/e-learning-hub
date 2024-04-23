import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from './entities/role.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { SortDto } from 'src/common/dto/query-sort.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  create(createRoleDto: CreateRoleDto) {
    const role = this.roleRepository.create(createRoleDto);

    return this.roleRepository.save(role);
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: any | null;
    sortOptions?: SortDto<RoleEntity>[] | null;
    paginationOptions: IPaginationOptions;
  }) {
    const entities = await this.roleRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: filterOptions as FindOptionsWhere<RoleEntity>,
      order: sortOptions?.reduce(
        (accumulator, sort) => ({
          ...accumulator,
          [sort.orderBy]: sort.order,
        }),
        {},
      ),
    });
    return entities;
  }

  async findOne(id: number) {
    const role = await this.roleRepository.findOne({
      where: { id },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return role;
  }

  async update(id: RoleEntity['id'], updateRoleDto: UpdateRoleDto) {
    const role = await this.roleRepository.save({
      id,
      ...updateRoleDto,
    });

    return role;
  }

  async softDelete(id: RoleEntity['id']) {
    const result = await this.roleRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Role not found');
    }
  }
}
