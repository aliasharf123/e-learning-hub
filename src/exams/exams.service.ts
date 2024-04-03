import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { ExamEntity } from './entities/exam.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { SubjectsService } from 'src/subjects/subjects.service';
import { SubjectEntity } from 'src/subjects/entities/subject.entity';
// import { UsersService } from 'src/users/users.service';

@Injectable()
export class ExamsService {
  constructor(
    @InjectRepository(ExamEntity)
    private examRepository: Repository<ExamEntity>,

    private subjectService: SubjectsService,
    // private usersService: UsersService,
  ) {}

  async create(createExamDto: CreateExamDto) {
    const subject = await this.subjectService.findOne({
      id: createExamDto.subjectId,
    });
    const exam = this.examRepository.create(createExamDto);
    exam.subject = subject;

    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    if (createExamDto.startsAt && createExamDto.endsAt) {
      this.validateExamDates(createExamDto.startsAt, createExamDto.endsAt);
      if (createExamDto.startsAt > new Date()) {
        exam.active = false;
      }
    }

    if (!exam.startsAt || !exam.endsAt) {
      throw new BadRequestException('You must Provide both start and end date');
    }

    return this.examRepository.save(exam);
  }

  validateExamDates(startsAt: Date, endsAt: Date) {
    if (startsAt > endsAt) {
      throw new BadRequestException('Start date cannot be after end date');
    }

    if (startsAt < new Date()) {
      throw new BadRequestException('Start date cannot be in the past');
    }

    if (endsAt < new Date()) {
      throw new BadRequestException('End date cannot be in the past');
    }

    if (startsAt === endsAt) {
      throw new BadRequestException('Start date and end date cannot be equal');
    }
  }

  findMany() {
    return this.examRepository.find();
  }

  findManybySubjectId(subjectId: SubjectEntity['id']) {
    return this.examRepository.find({ where: { subject: { id: subjectId } } });
  }

  async findOneById(id: number) {
    const exam = await this.examRepository.findOne({ where: { id } });
    if (!exam) {
      throw new NotFoundException(`Exam with id ${id} not found`);
    }
    return exam;
  }

  async update(id: number, updateExamDto: UpdateExamDto) {
    const exam = await this.findOneById(id);
    this.examRepository.merge(exam, updateExamDto);
    if (exam.startsAt && exam.endsAt) {
      this.validateExamDates(exam.startsAt, exam.endsAt);
    }
    return this.examRepository.save(exam);
  }

  async softDelete(id: number) {
    const exam = await this.examRepository.findOne({
      where: { id },
      relations: {
        questions: {
          options: true,
        },
      },
    });

    if (!exam) {
      throw new NotFoundException(`Exam with id ${id} not found`);
    }

    await this.examRepository.softRemove(exam);
  }

  async examExists(id: number) {
    const exists = await this.examRepository.exists({ where: { id } });
    if (!exists) {
      throw new NotFoundException(`Exam with id ${id} not found`);
    }
    return exists;
  }

  examEnded(examEndDate: Date) {
    return examEndDate < new Date();
  }

  examStarted(examStartDate: Date) {
    return examStartDate < new Date();
  }

  examIsLiveNow(exam: ExamEntity) {
    if (exam.startsAt && exam.endsAt)
      return this.examStarted(exam.startsAt) && !this.examEnded(exam.endsAt);
    return false;
  }
}
