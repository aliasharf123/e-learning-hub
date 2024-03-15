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
import { ExamQuestionEntity } from './entities/exam-question.entity';
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
      if (createExamDto.startsAt > createExamDto.endsAt) {
        throw new BadRequestException('Start date cannot be after end date');
      }

      if (createExamDto.startsAt < new Date()) {
        throw new BadRequestException('Start date cannot be in the past');
      }

      if (createExamDto.endsAt < new Date()) {
        throw new BadRequestException('End date cannot be in the past');
      }

      if (createExamDto.startsAt === createExamDto.endsAt) {
        throw new BadRequestException(
          'Start date and end date cannot be equal',
        );
      }

      if (createExamDto.startsAt > new Date()) {
        exam.active = false;
      }
    }

    if (!exam.startsAt || !exam.endsAt) {
      throw new BadRequestException('You must Provide both start and end date');
    }

    return this.examRepository.save(exam);
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

  async createExamAttempt(examId: number, studentId: number) {
    const exam = await this.examRepository.findOne({ where: { id: examId } });
    if (!exam) {
      throw new NotFoundException('Exam not found');
    }
    if (exam.startsAt && exam.startsAt > new Date()) {
      throw new BadRequestException('Exam has not started yet');
    }
    if (exam.endsAt && exam.endsAt < new Date()) {
      throw new BadRequestException('Exam has ended');
    }

    const attempt = await this.examAttemptRepository.findOne({
      where: { exam: { id: examId }, student: { id: studentId } },
    });
    if (attempt?.endsAt && attempt.endsAt < new Date()) {
      throw new BadRequestException('You have already attempted this exam');
    }

    // if (exam.durationInMinutes) {
    //   exam.endsAt = new Date(Date.now() + exam.durationInMinutes * 60000);
    // }

    const user = await this.usersService.findOne({ id: studentId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // create exam attempt
  }

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
