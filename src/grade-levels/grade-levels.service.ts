import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateGradeLevelDto } from './dto/create-grade-level.dto';
import { UpdateGradeLevelDto } from './dto/update-grade-level.dto';
import { GradeLevelRepository } from './grade-level.repository';
import { IPaginationOptions } from 'src/utils/types/pagination-options';

@Injectable()
export class GradeLevelsService {
  constructor(private readonly gradeLevelRepository: GradeLevelRepository) {}

  async create(createGradeLevelDto: CreateGradeLevelDto) {
    await this.isUniqueName(createGradeLevelDto.name);
    const gradeLevel =
      this.gradeLevelRepository.createGradeLevel(createGradeLevelDto);

    return gradeLevel;
  }

  findManyWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.gradeLevelRepository.findManyWithPagination({
      paginationOptions,
    });
  }

  findOne(id: number) {
    return this.gradeLevelRepository.findOne({ where: { id } });
  }

  async update(id: number, updateGradeLevelDto: UpdateGradeLevelDto) {
    if (updateGradeLevelDto.name)
      await this.isUniqueName(updateGradeLevelDto.name);
    return this.gradeLevelRepository.updateGradeLevel(id, updateGradeLevelDto);
  }

  async remove(id: number) {
    const gradeLevel = await this.gradeLevelRepository.findOne({
      where: { id },
    });
    if (!gradeLevel) {
      throw new NotFoundException(`Grade level with id ${id} not found`);
    }
    return this.gradeLevelRepository.deleteGradeLevel(id);
  }

  async isUniqueName(name: string) {
    const grade = await this.gradeLevelRepository.findOne({ where: { name } });
    if (grade) {
      throw new UnprocessableEntityException('Grade level name already exists');
    }
  }
}
