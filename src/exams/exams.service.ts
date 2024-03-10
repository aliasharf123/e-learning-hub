import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { ExamEntity } from './entities/exam.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ExamQuestionEntity } from './entities/exam-question.entity';
import { CreateExamQuestionDto } from './dto/create-exam-question.dto';
import { ExamOptionEntity } from './entities/exam-option.entity';
import { SubjectsService } from 'src/subjects/subjects.service';

@Injectable()
export class ExamsService {
  constructor(
    @InjectRepository(ExamEntity)
    private examRepository: Repository<ExamEntity>,
    @InjectRepository(ExamQuestionEntity)
    private examQuestionRepository: Repository<ExamQuestionEntity>,
    @InjectRepository(ExamOptionEntity)
    private examOptionRepository: Repository<ExamOptionEntity>,
    private subjectService: SubjectsService,
  ) {}

  createExam(createExamDto: CreateExamDto) {
    const exam = this.examRepository.create(createExamDto);
    return this.examRepository.save(exam);
  }

  findAllExams() {
    return this.examRepository.find();
  }

  async findOneExam(id: number) {
    const exam = await this.examRepository.findOne({ where: { id } });
    if (!exam) {
      throw new NotFoundException(`Exam with id ${id} not found`);
    }
    return exam;
  }

  async updateExam(id: number, updateExamDto: UpdateExamDto) {
    const exam = await this.findOneExam(id);
    this.examRepository.merge(exam, updateExamDto);
    return this.examRepository.save(exam);
  }

  async softDeleteExam(id: number) {
    await this.examExists(id);
    await this.examRepository.softDelete(id);
  }

  async examExists(id: number) {
    const exists = await this.examRepository.exists({ where: { id } });
    if (!exists) {
      throw new NotFoundException(`Exam with id ${id} not found`);
    }
    return exists;
  }

  async createQuestion(examId: number, questionDto: CreateExamQuestionDto) {
    console.log(questionDto.options);
    await this.examExists(examId);
    const question = this.examQuestionRepository.create(questionDto);
    console.log(question);
    question.examId = examId;

    const options = this.examOptionRepository.create(questionDto.options);
    question.options = options;
    console.log('here');
    return this.examQuestionRepository.save(question);
  }
}
