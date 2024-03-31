import { InjectRepository } from '@nestjs/typeorm';
import {
  ExamQuestionEntity,
  QuestionType,
} from './entities/exam-question.entity';
import { Repository } from 'typeorm';
import { ExamOptionEntity } from './entities/exam-option.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateExamQuestionDto } from './dto/create-exam-question.dto';
import { UpdateExamQuestionDto } from './dto/update-exam-question.dto';
import { ExamsService } from './exams.service';

export class QuestionsService {
  constructor(
    @InjectRepository(ExamQuestionEntity)
    private readonly examQuestionRepository: Repository<ExamQuestionEntity>,
    @InjectRepository(ExamOptionEntity)
    private readonly examOptionRepository: Repository<ExamOptionEntity>,
    private readonly examsService: ExamsService,
  ) {}

  validateTrueOrFalseQuestionOptions(options: ExamOptionEntity[]) {
    if (options.length !== 2) {
      throw new BadRequestException(
        'True or false question must have 2 options',
      );
    }
    if (options[0].correct === options[1].correct) {
      throw new BadRequestException(
        'True or false question must have one correct and one incorrect option',
      );
    }

    options.forEach((option) => {
      option.value = option.value.toLowerCase();
    });

    if (
      !options.some((option) => option.value === 'true') ||
      !options.some((option) => option.value === 'false')
    ) {
      throw new BadRequestException(
        'True or false question must have one option with value true and one with value false',
      );
    }
  }

  validateMultipleChoiceQuestionOptions(options: ExamOptionEntity[]) {
    if (options.length < 2) {
      throw new BadRequestException(
        'Multiple choice question must have 2 options',
      );
    }
    const correctOptions = options.filter((option) => option.correct);
    if (correctOptions.length < 1) {
      throw new BadRequestException(
        'Multiple choice question must have at least one correct option',
      );
    }
  }

  validateQuestionOptions(
    questionType: QuestionType,
    options: ExamOptionEntity[],
  ) {
    switch (questionType) {
      case QuestionType.TRUE_OR_FALSE:
        this.validateTrueOrFalseQuestionOptions(options);
        break;
      case QuestionType.MULTIPLE_CHOICE:
        this.validateMultipleChoiceQuestionOptions(options);
        break;
      default:
        break;
    }
  }

  createQuestionOptions(
    questionType: QuestionType,
    options: ExamOptionEntity[],
  ) {
    this.validateQuestionOptions(questionType, options);
    return this.examOptionRepository.create(options);
  }

  async createQuestion(examId: number, questionDto: CreateExamQuestionDto) {
    await this.examsService.examExists(examId);
    const question = this.examQuestionRepository.create(questionDto);
    question.examId = examId;

    const options = this.createQuestionOptions(
      questionDto.type,
      questionDto.options,
    );
    question.options = options;
    return this.examQuestionRepository.save(question);
  }

  async findQuestionById(examId: number, questionId: number) {
    await this.examsService.examExists(examId);
    const question = await this.examQuestionRepository.findOne({
      where: { id: questionId, examId },
    });
    if (!question) {
      throw new NotFoundException(`Question with id ${questionId} not found`);
    }
    return question;
  }

  async findAllQuestionsByExamId(examId: number) {
    await this.examsService.examExists(examId);
    return this.examQuestionRepository.find({
      where: { examId },
    });
  }

  async updateQuestion(
    examId: number,
    questionId: number,
    updateQuestionDto: UpdateExamQuestionDto,
  ) {
    await this.examsService.examExists(examId);
    const question = await this.findQuestionById(examId, questionId);
    this.examQuestionRepository.merge(question, updateQuestionDto);

    if (updateQuestionDto.options) {
      const options = this.createQuestionOptions(
        question.type,
        updateQuestionDto.options,
      );
      question.options = options;
    }
    return this.examQuestionRepository.save(question);
  }

  async softDeleteQuestion(examId: number, questionId: number) {
    await this.examsService.examExists(examId);
    const question = await this.findQuestionById(examId, questionId);
    await this.examQuestionRepository.softRemove(question);
  }
}
