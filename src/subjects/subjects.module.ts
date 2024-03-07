import { Module } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { SubjectsController } from './subjects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubjectEntity } from './entities/subject.entity';
import { SubjectRepository } from './subject-repository';
import { GradeLevelsModule } from 'src/grade-levels/grade-levels.module';

@Module({
  imports: [GradeLevelsModule, TypeOrmModule.forFeature([SubjectEntity])],
  controllers: [SubjectsController],
  providers: [SubjectsService, SubjectRepository],
})
export class SubjectsModule {}
