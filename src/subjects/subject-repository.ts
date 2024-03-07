import { Repository } from 'typeorm';
import { SubjectEntity } from './entities/subject.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { NotFoundException } from '@nestjs/common';

export class SubjectRepository extends Repository<SubjectEntity> {
  constructor(
    @InjectRepository(SubjectEntity)
    private readonly subjectRepository: Repository<SubjectEntity>,
  ) {
    super(
      subjectRepository.target,
      subjectRepository.manager,
      subjectRepository.queryRunner,
    );
  }
  async createOne(createSubjectDto: CreateSubjectDto): Promise<SubjectEntity> {
    const subject = this.create(createSubjectDto);
    return await this.save(subject);
  }

  async findManyWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<SubjectEntity[]> {
    return this.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });
  }

  async updateSubjectById(id: number, updateSubjectDto: UpdateSubjectDto) {
    const subject = await this.findOne({ where: { id } });
    if (!subject) {
      throw new NotFoundException(`Subject with id ${id} not found`);
    }
    this.merge(subject, updateSubjectDto);
    return await this.save(subject);
  }
}
