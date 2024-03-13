import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { SubjectRepository } from './subject.repository';
import { GradeLevelsService } from 'src/grade-levels/grade-levels.service';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { SubjectEntity } from './entities/subject.entity';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { FindOptionsWhere } from 'typeorm';
import { QueryOptionsDto } from './dto/query-options.dto';

@Injectable()
export class SubjectsService {
  constructor(
    private readonly subjectRepository: SubjectRepository,
    private readonly gradeLevelsService: GradeLevelsService,
  ) {}

  async create(createSubjectDto: CreateSubjectDto) {
    const subject = this.subjectRepository.create(createSubjectDto);
    subject.gradeLevel = await this.gradeLevelsService.findOne(
      createSubjectDto.gradeLevelId,
    );
    return this.subjectRepository.save(subject);
  }

  findManyWithPagination(
    {
      paginationOptions,
    }: {
      paginationOptions: IPaginationOptions;
    },
    queryOptions: QueryOptionsDto,
  ) {
    return this.subjectRepository.findManyWithPagination(
      {
        paginationOptions,
      },
      queryOptions,
    );
  }

  async findOne(fields: EntityCondition<SubjectEntity>) {
    const subject = await this.subjectRepository.findOne({
      where: fields as FindOptionsWhere<SubjectEntity>,
    });
    if (!subject) {
      throw new NotFoundException(`Subject with id ${fields.id} not found`);
    }
    return subject;
  }

  async updateSubject(id: number, updateSubjectDto: UpdateSubjectDto) {
    const subject = await this.subjectRepository.updateSubjectById(
      id,
      updateSubjectDto,
    );
    return subject;
  }

  async softDelete(id: number) {
    await this.subjectRepository.softDelete(id);
  }
}
