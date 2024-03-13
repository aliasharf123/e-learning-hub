import { Repository } from 'typeorm';
import { ExamEntity } from './entities/exam.entity';

export class ExamRepository extends Repository<ExamEntity> {}
