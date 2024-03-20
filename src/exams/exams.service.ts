import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { ExamEntity } from './entities/exam.entity';
import { In, Repository } from 'typeorm';
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
import {
  ExamAttemptEntity,
  ExamAttemptStatus,
} from './entities/exam-attempt.entity';
import { ExamAttemptChoiceEntity } from './entities/exam-attempt-choice.entity';
import { UpdateAttemptChoiceDto } from './dto/update-attempt-choices.dto';

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
    @InjectRepository(ExamAttemptChoiceEntity)
    private examAttemptChoiceRepository: Repository<ExamAttemptChoiceEntity>,
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

    if (exam.isAttemptedOnce) {
      throw new BadRequestException('This Exam can only be attempted once');
    }

    await this.examAttemptRepository.softRemove(existingAttempt);

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

  attemptExpired(attempt: ExamAttemptEntity): boolean {
    return attempt.endsAt !== undefined && attempt.endsAt < new Date();
  }

  async createExamAttempt(examId: number, studentId: number) {
    const exam = await this.findOneExamById(examId);
    if (exam.isLiveExam) {
      return this.createAttemptForLiveExam(exam, studentId);
    }
    return this.createAttemptForRegularExam(exam, studentId);
  }

  async findAttemptById(attemptId: number) {
    const attempt = await this.examAttemptRepository.findOne({
      where: { id: attemptId },
      relations: {
        exam: true,
        student: true,
      },
      select: {
        student: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    });
    if (!attempt) {
      throw new NotFoundException(`Attempt with id ${attemptId} not found`);
    }
    return attempt;
  }

  async findAttemptsByExamId(examId: number) {
    await this.examExists(examId);
    return this.examAttemptRepository.find({
      where: { exam: { id: examId } },
    });
  }

  async findAttemptsByStudentId(studentId: number) {
    const student = await this.usersService.findOne({ id: studentId });
    if (!student) {
      throw new NotFoundException(`Student with id ${studentId} not found`);
    }
    return this.examAttemptRepository.find({
      where: { student: { id: studentId } },
    });
  }

  async submitAttempt(attemptId: number) {
    const attempt = await this.examAttemptRepository.findOne({
      where: { id: attemptId },
      relations: {
        exam: true,
        choices: true,
      },
      select: {
        exam: {
          questions: true,
        },
      },
    });
    if (!attempt) {
      throw new NotFoundException(`Attempt with id ${attemptId} not found`);
    }
    if (attempt.status === ExamAttemptStatus.FINISHED) {
      throw new BadRequestException('Attempt has already been submitted');
    }
    if (attempt.exam.isLiveExam) {
      return this.submitAttemptForLiveExam(attempt);
    }
    return this.submitAttemptForRegularExam(attempt);
  }

  async submitAttemptForRegularExam(attempt: ExamAttemptEntity) {
    if (attempt.status === ExamAttemptStatus.FINISHED) {
      throw new BadRequestException('Attempt has already been submitted');
    }

    if (!this.allRequiredQuestionsSolved(attempt)) {
      throw new BadRequestException(
        `You must mark all the required questions.`,
      );
    }

    const evaluatedAttempt = this.evaluateAttemptScore(attempt);
    return evaluatedAttempt;
  }

  async submitAttemptForLiveExam(attempt: ExamAttemptEntity) {
    if (!this.examIsLiveNow(attempt.exam)) {
      throw new BadRequestException('Exam has ended');
    }

    if (attempt.status === ExamAttemptStatus.FINISHED) {
      throw new BadRequestException('Attempt has already been submitted');
    }

    // if (!this.allRequiredQuestionsSolved(attempt)) {
    //   throw new BadRequestException(
    //     `You must mark all the required questions.`,
    //   );
    // }

    if (this.attemptExpired(attempt)) {
      throw new BadRequestException('Attempt has expired');
    }

    const evaluatedAttempt = this.evaluateAttemptScore(attempt);
    return evaluatedAttempt;
  }

  allRequiredQuestionsSolved(attempt: ExamAttemptEntity) {
    const markedQuestions = attempt.choices.map((choice) => choice.question.id);
    const requiredQuestions = attempt.exam.questions
      .filter((question) => !question.isOptional)
      .map((question) => question.id);
    return requiredQuestions.every((question) =>
      markedQuestions.includes(question),
    );
  }

  async evaluateAttemptScore(attempt: ExamAttemptEntity) {
    const score = attempt.choices.reduce((acc, choice) => {
      return acc + this.evaluateChoiceScore(choice);
    }, 0);

    attempt.score = score;
    attempt.status = ExamAttemptStatus.FINISHED;
    return this.examAttemptRepository.save(attempt);
  }

  evaluateChoiceScore(choice: ExamAttemptChoiceEntity): number {
    const { question, selectedOptions } = choice;

    if (question.type === QuestionType.TRUE_OR_FALSE) {
      const isCorrect = selectedOptions[0]?.correct;
      return isCorrect ? question.points : 0;
    }

    if (question.type === QuestionType.MULTIPLE_CHOICE) {
      const correctOptions = question.options.filter(
        (option) => option.correct,
      );
      const hasCorrectOptions = selectedOptions.every(
        (option) => option.correct,
      );

      return correctOptions.length === selectedOptions.length &&
        hasCorrectOptions
        ? question.points
        : 0;
    }

    return 0;
  }

  async createOrUpdateExamAttemptChoice(
    attemptId: number,
    updateAttemptChoicesDto: UpdateAttemptChoiceDto,
  ) {
    const attempt = await this.examAttemptRepository.findOne({
      where: { id: attemptId },
      relations: {
        exam: true,
        choices: true,
      },
      select: {
        exam: {
          questions: true,
        },
      },
    });
    if (!attempt) {
      throw new NotFoundException(`Attempt with id ${attemptId} not found`);
    }
    if (attempt.status === ExamAttemptStatus.FINISHED) {
      throw new BadRequestException('Attempt has already been submitted');
    }

    // make sure the question exists and all the selected options are valid
    const question = await this.examQuestionRepository.findOne({
      where: { id: updateAttemptChoicesDto.questionId },
    });
    if (!question) {
      throw new NotFoundException(
        `Question with id ${updateAttemptChoicesDto.questionId} not found`,
      );
    }
    const selectedOptions = await this.examOptionRepository.find({
      where: {
        id: In(updateAttemptChoicesDto.selectedOptionsIds),
        question: { id: question.id },
      },
    });
    if (
      selectedOptions.length !==
      updateAttemptChoicesDto.selectedOptionsIds.length
    ) {
      throw new BadRequestException('Invalid selected options');
    }

    await this.examAttemptChoiceRepository.softDelete({
      attempt: { id: attemptId },
      question: { id: question.id },
    });

    const newChoice = this.examAttemptChoiceRepository.create({
      attempt: { id: attemptId },
      question: { id: question.id },
      selectedOptions,
    });
    return this.examAttemptChoiceRepository.save(newChoice);
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
