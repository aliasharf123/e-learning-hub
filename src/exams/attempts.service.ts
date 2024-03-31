import { InjectRepository } from '@nestjs/typeorm';
import {
  ExamAttemptEntity,
  ExamAttemptStatus,
} from './entities/exam-attempt.entity';
import { In, Repository } from 'typeorm';
import { ExamAttemptChoiceEntity } from './entities/exam-attempt-choice.entity';
import { ExamsService } from './exams.service';
import { ExamEntity } from './entities/exam.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { QuestionType } from './entities/exam-question.entity';
import { UpdateAttemptChoiceDto } from './dto/update-attempt-choices.dto';

export class AttemptsService {
  examQuestionRepository: any;
  constructor(
    @InjectRepository(ExamAttemptEntity)
    private examAttemptRepository: Repository<ExamAttemptEntity>,
    @InjectRepository(ExamAttemptChoiceEntity)
    private examAttemptChoiceRepository: Repository<ExamAttemptChoiceEntity>,
    private readonly examsService: ExamsService,
  ) {}

  async create(examId: number, studentId: number) {
    const exam = await this.examsService.findOneExamById(examId);
    if (exam.isLiveExam) {
      return this.createForLiveExam(exam, studentId);
    }
    return this.createForRegularExam(exam, studentId);
  }

  async createForLiveExam(exam: ExamEntity, studentId: number) {
    if (this.examsService.examEnded(exam)) {
      if (!exam.enableAfterEndTime) {
        throw new BadRequestException('Exam has ended');
      }
      return this.createForRegularExam(exam, studentId);
    }
    if (!this.examsService.examStarted(exam)) {
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

  async createForRegularExam(exam: ExamEntity, studentId: number) {
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

  async findOneById(examId: number, attemptId: number) {
    const attempt = await this.examAttemptRepository.findOne({
      where: { id: attemptId, exam: { id: examId } },
      relations: {
        exam: true,
        student: true,
        choices: true,
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

  async findManyByExamId(examId: number) {
    await this.examsService.examExists(examId);
    return this.examAttemptRepository.find({
      where: { exam: { id: examId } },
    });
  }

  async findManyByStudentId(studentId: number) {
    // const student = await this.usersService.findOne({ id: studentId });
    // if (!student) {
    //   throw new NotFoundException(`Student with id ${studentId} not found`);
    // }
    return this.examAttemptRepository.find({
      where: { student: { id: studentId } },
    });
  }

  async submitAttempt(exmaId: number, attemptId: number) {
    const attempt = await this.examAttemptRepository.findOne({
      where: { id: attemptId, exam: { id: exmaId } },
      relations: {
        exam: true,
        choices: true,
      },
      select: {
        exam: {
          isLiveExam: true,
          startsAt: true,
          endsAt: true,
          questions: true,
        },
        choices: true,
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
    if (!this.examsService.examIsLiveNow(attempt.exam)) {
      throw new BadRequestException('Exam has ended');
    }

    if (attempt.status === ExamAttemptStatus.FINISHED) {
      throw new BadRequestException('Attempt has already been submitted');
    }

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
    const choices = await this.examAttemptChoiceRepository.find({
      where: { attempt: { id: attempt.id } },
      relations: { selectedOptions: true, question: true },
    });
    console.log(choices);
    const score = choices.reduce((acc, choice) => {
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
    examId: number,
    attemptId: number,
    updateAttemptChoicesDto: UpdateAttemptChoiceDto,
  ) {
    const attempt = await this.examAttemptRepository.findOne({
      where: { id: attemptId, exam: { id: examId } },
      relations: {
        exam: true,
        choices: true,
      },
      select: {
        exam: {
          questions: true,
        },
        choices: true,
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
    const selectedOptions = await this.examQuestionRepository.find({
      where: {
        id: In(updateAttemptChoicesDto.selectedOptionsIds),
        question: { id: question.id, exam: { id: examId } },
      },
    });
    if (
      selectedOptions.length !==
      updateAttemptChoicesDto.selectedOptionsIds.length
    ) {
      throw new BadRequestException('Invalid selected options');
    }

    const existingChoice = await this.examAttemptChoiceRepository.findOne({
      where: { attempt: { id: attemptId }, question: { id: question.id } },
    });

    if (existingChoice) {
      existingChoice.selectedOptions = selectedOptions;
      return this.examAttemptChoiceRepository.save(existingChoice);
    }

    const newChoice = this.examAttemptChoiceRepository.create({
      attempt: { id: attemptId },
      question: { id: question.id },
      selectedOptions,
    });
    return this.examAttemptChoiceRepository.save(newChoice);
  }

  async findAllChoicesByAttemptId(examId: number, attemptId: number) {
    const attempt = await this.examAttemptRepository.findOne({
      where: { id: attemptId, exam: { id: examId } },
      relations: {
        choices: {
          question: true,
          selectedOptions: true,
        },
      },
    });
    if (!attempt) {
      throw new NotFoundException(`Attempt with id ${attemptId} not found`);
    }
    return attempt.choices;
  }
}
