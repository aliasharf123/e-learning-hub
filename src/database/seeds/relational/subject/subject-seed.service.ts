import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubjectEntity } from 'src/subjects/entities/subject.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SubjectSeedService {
  constructor(
    @InjectRepository(SubjectEntity)
    private readonly subjectRepository: Repository<SubjectEntity>,
  ) {}

  async run() {
    const count = await this.subjectRepository.count();

    if (!count) {
      await this.subjectRepository.save([
        this.subjectRepository.create({
          name: 'Mathematics',
          gradeLevelId: 1,
          description: 'Mathematics subject',
        }),
        this.subjectRepository.create({
          name: 'Physics',
          gradeLevelId: 1,
          description: 'Physics subject',
        }),
      ]);
    }
  }
}
