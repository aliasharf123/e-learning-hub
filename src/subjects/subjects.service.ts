import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { GradeLevelsService } from 'src/grade-levels/grade-levels.service';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { SubjectEntity } from './entities/subject.entity';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { FindOptionsWhere, Repository } from 'typeorm';
import { QueryOptionsDto } from './dto/query-options.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(SubjectEntity)
    private readonly subjectRepository: Repository<SubjectEntity>,
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
    return this.subjectRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: queryOptions,
      relations: {
        lectures: queryOptions.includeLessons,
      },
    });
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
    const updatedSubject = await this.subjectRepository.update(
      id,
      updateSubjectDto,
    );
    if (updatedSubject.affected === 0) {
      throw new NotFoundException(`Subject with id ${id} not found`);
    }
    const subject = await this.subjectRepository.findOne({ where: { id } });
    return subject;
  }

  async softDelete(id: number) {
    const deletedSubject = await this.subjectRepository.softDelete(id);

    if (deletedSubject.affected === 0) {
      throw new NotFoundException(`Subject with id ${id} not found`);
    }
  }
}
