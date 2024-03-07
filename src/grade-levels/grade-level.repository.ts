import { Repository } from 'typeorm';
import { CreateGradeLevelDto } from './dto/create-grade-level.dto';
import { GradeLevelEntity } from './entities/grade-level.entity';
import { UpdateGradeLevelDto } from './dto/update-grade-level.dto';
import { NotFoundException } from '@nestjs/common';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { InjectRepository } from '@nestjs/typeorm';

export class GradeLevelRepository extends Repository<GradeLevelEntity> {
  constructor(
    @InjectRepository(GradeLevelEntity)
    private gradeLevelRepository: Repository<GradeLevelEntity>,
  ) {
    super(
      gradeLevelRepository.target,
      gradeLevelRepository.manager,
      gradeLevelRepository.queryRunner,
    );
  }

  async createGradeLevel(
    createGradeLevelDto: CreateGradeLevelDto,
  ): Promise<GradeLevelEntity> {
    const gradeLevel = this.create(createGradeLevelDto);
    return gradeLevel.save();
  }

  async findManyWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<GradeLevelEntity[]> {
    return this.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });
  }

  async updateGradeLevel(
    id: number,
    updateGradeLevelDto: UpdateGradeLevelDto,
  ): Promise<GradeLevelEntity> {
    const gradeLevel = await this.findOne({ where: { id } });
    if (!gradeLevel) {
      throw new NotFoundException(`Grade level with id ${id} not found`);
    }
    this.merge(gradeLevel, updateGradeLevelDto);
    return gradeLevel.save();
  }

  async deleteGradeLevel(id: number): Promise<void> {
    await this.delete(id);
  }
}
