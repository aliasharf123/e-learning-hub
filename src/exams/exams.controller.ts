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

@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Post()
  createExam(@Body() createExamDto: CreateExamDto) {
    return this.examsService.createExam(createExamDto);
  }

  @Get()
  findAllExams() {
    return this.examsService.findAllExams();
  }

  @Get(':id')
  findOneExam(@Param('id') id: string) {
    return this.examsService.findOneExamById(+id);
  }

  @Patch(':id')
  updateExam(@Param('id') id: string, @Body() updateExamDto: UpdateExamDto) {
    return this.examsService.updateExam(+id, updateExamDto);
  }

  @Delete(':id')
  softDeleteExam(@Param('id') id: string) {
    return this.examsService.softDeleteExam(+id);
  }

  @Post(':examId/questions')
  createQuestion(
    @Param('examId') examId: string,
    @Body() questionDto: CreateExamQuestionDto,
  ) {
    return this.examsService.createQuestion(+examId, questionDto);
  }
}
