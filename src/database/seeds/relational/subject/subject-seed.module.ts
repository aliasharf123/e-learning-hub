import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubjectEntity } from 'src/subjects/entities/subject.entity';
import { SubjectSeedService } from './subject-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([SubjectEntity])],
  providers: [SubjectSeedService],
  exports: [SubjectSeedService],
})
export class SubjectSeedModule {}
