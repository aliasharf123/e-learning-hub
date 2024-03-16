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
import {
  ExamQuestionEntity,
  QuestionType,
} from './entities/exam-question.entity';
import { CreateExamQuestionDto } from './dto/create-exam-question.dto';
import { ExamOptionEntity } from './entities/exam-option.entity';
import { SubjectsService } from 'src/subjects/subjects.service';
import { UpdateExamQuestionDto } from './dto/update-exam-question.dto';
import { SubjectEntity } from 'src/subjects/entities/subject.entity';
import { UsersService } from 'src/users/users.service';
import { ExamAttemptEntity } from './entities/exam-attempt.entity';

@Injectable()
export class ExamsService {
  constructor(
    @InjectRepository(ExamEntity)
    private examRepository: Repository<ExamEntity>,
    @InjectRepository(ExamQuestionEntity)
    private examQuestionRepository: Repository<ExamQuestionEntity>,
    @InjectRepository(ExamOptionEntity)
    private examOptionRepository: Repository<ExamOptionEntity>,
    @InjectRepository(ExamAttemptEntity)
    private examAttemptRepository: Repository<ExamAttemptEntity>,
    private subjectService: SubjectsService,
    private usersService: UsersService,
  ) {}

  async createExam(createExamDto: CreateExamDto) {
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

  findAllExams() {
    return this.examRepository.find();
  }

  findAllExamsbySubject(subjectId: SubjectEntity['id']) {
    return this.examRepository.find({ where: { subject: { id: subjectId } } });
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
    if (exam.startsAt && exam.endsAt) {
      this.validateExamDates(exam.startsAt, exam.endsAt);
    }
    return this.examRepository.save(exam);
  }

  async softDeleteExam(id: number) {
    // await this.examExists(id);
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
    if (questionType === QuestionType.TRUE_OR_FALSE) {
      this.validateTrueOrFalseQuestionOptions(options);
    }
    this.validateMultipleChoiceQuestionOptions(options);
  }

  createQuestionOptions(
    questionType: QuestionType,
    options: ExamOptionEntity[],
  ) {
    this.validateQuestionOptions(questionType, options);
    return this.examOptionRepository.create(options);
  }

  async createQuestion(examId: number, questionDto: CreateExamQuestionDto) {
    await this.examExists(examId);
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
    await this.examExists(examId);
    const question = await this.examQuestionRepository.findOne({
      where: { id: questionId, examId },
    });
    if (!question) {
      throw new NotFoundException(`Question with id ${questionId} not found`);
    }
    return question;
  }

  async findAllQuestionsByExamId(examId: number) {
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
      const options = this.createQuestionOptions(
        question.type,
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

  async createAttemptForLiveExam(exam: ExamEntity, studentId: number) {
    if (this.examEnded(exam)) {
      if (!exam.enableAfterEndTime) {
        throw new BadRequestException('Exam has ended');
      }
      return this.createAttemptForRegularExam(exam, studentId);
    }
    if (!this.examStarted(exam)) {
      throw new BadRequestException('Exam has not started yet');
    }
    const existingAttempt = await this.examAttemptRepository.findOne({
      where: { exam: { id: exam.id }, student: { id: studentId } },
    });
    if (!existingAttempt) {
      const newAttempt = this.examAttemptRepository.create({
        exam: { id: exam.id },
        student: { id: studentId },
        endsAt: exam.endsAt,
        choices: [],
      });
      return this.examAttemptRepository.save(newAttempt);
    }
    if (!this.attemptExpired(existingAttempt)) {
      return existingAttempt;
    }

    await this.examAttemptRepository.softRemove(existingAttempt);

    const newAttempt = this.examAttemptRepository.create({
      exam: { id: exam.id },
      student: { id: studentId },
      endsAt: exam.endsAt,
      choices: [],
    });
    return this.examAttemptRepository.save(newAttempt);
  }

  async createAttemptForRegularExam(exam: ExamEntity, studentId: number) {
    const existingAttempt = await this.examAttemptRepository.findOne({
      where: { exam: { id: exam.id }, student: { id: studentId } },
    });
    if (!existingAttempt) {
      if (!exam.durationInMinutes) {
        throw new BadRequestException('Exam duration is required');
      }
      const newAttempt = this.examAttemptRepository.create({
        exam: { id: exam.id },
        student: { id: studentId },
        endsAt: new Date(Date.now() + exam.durationInMinutes * 60000),
        choices: [],
      });
      return this.examAttemptRepository.save(newAttempt);
    }
    if (!this.attemptExpired(existingAttempt)) {
      return existingAttempt;
    }
    await this.examAttemptRepository.softRemove(existingAttempt);

    if (exam.isAttemptedOnce) {
      throw new BadRequestException('This Exam can only be attempted once');
    }

    if (!exam.durationInMinutes) {
      throw new BadRequestException('Exam duration is required');
    }
    const newAttempt = this.examAttemptRepository.create({
      exam: { id: exam.id },
      student: { id: studentId },
      endsAt: new Date(Date.now() + exam.durationInMinutes * 60000),
      choices: [],
    });
    return this.examAttemptRepository.save(newAttempt);
  }

  attemptExpired(attempt: ExamAttemptEntity) {
    return attempt.endsAt && attempt.endsAt < new Date();
  }

  async createExamAttempt(examId: number, studentId: number) {
    const exam = await this.findOneExamById(examId);
    if (exam.isLiveExam) {
      return this.createAttemptForLiveExam(exam, studentId);
    }
    return this.createAttemptForRegularExam(exam, studentId);
  }

  examEnded(exam: ExamEntity) {
    return exam.endsAt && exam.endsAt < new Date();
  }

  examStarted(exam: ExamEntity) {
    return exam.startsAt && exam.startsAt > new Date();
  }

  examIsLiveNow(exam: ExamEntity) {
    return this.examStarted(exam) && !this.examEnded(exam);
  }
}
