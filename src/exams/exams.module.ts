import { Module } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { ExamsController } from './exams.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamEntity } from './entities/exam.entity';
import { ExamQuestionEntity } from './entities/exam-question.entity';
import { ExamAttemptEntity } from './entities/exam-attempt.entity';
import { ExamOptionEntity } from './entities/exam-option.entity';
import { ExamAttemptChoiceEntity } from './entities/exam-attempt-choice.entity';
import { SubjectsModule } from 'src/subjects/subjects.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ExamEntity,
      ExamQuestionEntity,
      ExamOptionEntity,
      ExamAttemptEntity,
      ExamAttemptChoiceEntity,
    ]),
    SubjectsModule,
  ],
  controllers: [ExamsController],
  providers: [ExamsService],
})
export class ExamsModule {}
