import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ExamsService } from './exams.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { CreateExamQuestionDto } from './dto/create-exam-question.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdateAttemptChoiceDto } from './dto/update-attempt-choices.dto';
import { QuestionsService } from './questions.service';
import { AttemptsService } from './attempts.service';

@ApiTags('Exams')
@Controller('exams')
export class ExamsController {
  constructor(
    private readonly examsService: ExamsService,
    private readonly questionsService: QuestionsService,
    private readonly attemtsService: AttemptsService,
  ) {}

  @Post()
  createExam(@Body() createExamDto: CreateExamDto) {
    return this.examsService.create(createExamDto);
  }


  @Get()
  findManyExams() {
    return this.examsService.findMany();
  }


  @Get(':id')
  findOneExam(@Param('id') id: string) {
    return this.examsService.findOneById(+id);
  }

  @Patch(':id')
  updateExam(@Param('id') id: string, @Body() updateExamDto: UpdateExamDto) {
    return this.examsService.update(+id, updateExamDto);
  }

  @Delete(':id')
  softDeleteExam(@Param('id') id: string) {
    return this.examsService.softDelete(+id);
  }

  @Post(':examId/questions')
  createQuestion(
    @Param('examId') examId: string,
    @Body() questionDto: CreateExamQuestionDto,
  ) {
    return this.questionsService.createQuestion(+examId, questionDto);
  }

  @Get(':examId/questions')
  findAllQuestionsByExamId(@Param('examId') examId: string) {
    return this.questionsService.findAllQuestionsByExamId(+examId);
  }

  @Get(':examId/questions/:questionId')
  findOneQuestion(
    @Param('examId') examId: string,
    @Param('questionId') questionId: string,
  ) {
    return this.questionsService.findQuestionById(+examId, +questionId);
  }

  @Patch(':examId/questions/:questionId')
  updateQuestion(
    @Param('examId') examId: string,
    @Param('questionId') questionId: string,
    @Body() questionDto: CreateExamQuestionDto,
  ) {
    return this.questionsService.updateQuestion(
      +examId,
      +questionId,
      questionDto,
    );
  }

  @Delete(':examId/questions/:questionId')
  softDeleteQuestion(
    @Param('examId') examId: string,
    @Param('questionId') questionId: string,
  ) {
    return this.questionsService.softDeleteQuestion(+examId, +questionId);
  }

  @Post(':examId/attempts')
  createExamAttempt(@Param('examId') examId: string) {
    // do not forget to add the actual user id
    return this.attemtsService.create(+examId, 1);
  }

  @Get(':examId/attempts')
  findAllAttemptsByExamId(@Param('examId') examId: string) {
    return this.attemtsService.findManyByExamId(+examId);
  }

  @Get(':examId/attempts/:attemptId')
  findOneAttempt(
    @Param('examId') examId: string,
    @Param('attemptId') attemptId: string,
  ) {
    return this.attemtsService.findOneById(+examId, +attemptId);
  }

  @Patch(':examId/attempts/:attemptId')
  updateAttemptChoice(
    @Param('examId') examId: string,
    @Param('attemptId') attemptId: string,
    @Body() updateAttemptChoiceDto: UpdateAttemptChoiceDto,
  ) {
    return this.attemtsService.createOrUpdateExamAttemptChoice(
      +examId,
      +attemptId,
      updateAttemptChoiceDto,
    );
  }

  @Post(':examId/attempts/:attemptId/submit')
  submitAttempt(
    @Param('examId') examId: string,
    @Param('attemptId') attemptId: string,
  ) {
    return this.attemtsService.submitAttempt(+examId, +attemptId);
  }

  @Get(':examId/attempts/:attemptId/choices')
  findAllChoicesByAttemptId(
    @Param('examId') examId: string,
    @Param('attemptId') attemptId: string,
  ) {
    return this.attemtsService.findAllChoicesByAttemptId(+examId, +attemptId);
  }
}
