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
import { UpdateExamQuestionDto } from './dto/update-exam-question.dto';

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

  async findOneExamById(id: number) {
    const exam = await this.examRepository.findOne({ where: { id } });
    if (!exam) {
      throw new NotFoundException(`Exam with id ${id} not found`);
    }
    return exam;
  }

  async updateExam(id: number, updateExamDto: UpdateExamDto) {
    const exam = await this.findOneExamById(id);
    this.examRepository.merge(exam, updateExamDto);
    return this.examRepository.save(exam);
  }

  async softDeleteExam(id: number) {
    // await this.examExists(id);
    const exam = await this.examRepository.findOneOrFail({
      where: { id },
      relations: {
        questions: {
          options: true,
        },
      },
    });

    await this.examRepository.softRemove(exam);
  }

  async examExists(id: number) {
    const exists = await this.examRepository.exists({ where: { id } });
    if (!exists) {
      throw new NotFoundException(`Exam with id ${id} not found`);
    }
    return exists;
  }

  async createQuestion(examId: number, questionDto: CreateExamQuestionDto) {
    await this.examExists(examId);
    const question = this.examQuestionRepository.create(questionDto);
    console.log(question);
    question.examId = examId;

    const options = this.examOptionRepository.create(questionDto.options);
    question.options = options;
    return this.examQuestionRepository.save(question);
  }

  async findQuestionById(examId: number, questionId: number) {
    await this.examExists(examId);
    const question = await this.examQuestionRepository.findOne({
      where: { id: questionId, examId },
    });
    if (!question) {
      throw new NotFoundException(`Question with id ${questionId} not found`);
    }
    return question;
  }

  async findAllQuestions(examId: number) {
    await this.examExists(examId);
    return this.examQuestionRepository.find({ where: { examId } });
  }

  async updateQuestion(
    examId: number,
    questionId: number,
    updateQuestionDto: UpdateExamQuestionDto,
  ) {
    await this.examExists(examId);
    const question = await this.findQuestionById(examId, questionId);
    this.examQuestionRepository.merge(question, updateQuestionDto);

    if (updateQuestionDto.options) {
      const options = this.examOptionRepository.create(
        updateQuestionDto.options,
      );
      question.options = options;
    }
    return this.examQuestionRepository.save(question);
  }

  async softDeleteQuestion(examId: number, questionId: number) {
    await this.examExists(examId);
    const question = await this.findQuestionById(examId, questionId);
    await this.examQuestionRepository.softRemove(question);
  }

  // async createExamAttempt(examId: number, userId: number) {
  //   await this.examExists(examId);

  //   // create exam attempt
  // }

  // async updateQuestionOptions(
  //   questionId: number,
  //   updateExamOptionsDto: UpdateExamOptionDto[],
  // ) {
  //   const question = await this.examQuestionRepository.findOne({
  //     where: { id: questionId },
  //     relations: ['options'],
  //   });
  //   if (!question) {
  //     throw new NotFoundException(`Question with id ${questionId} not found`);
  //   }
  //   const options = this.examOptionRepository.create(updateExamOptionsDto);
  //   question.options = options;
  //   return this.examQuestionRepository.save(question);
  // }
}
