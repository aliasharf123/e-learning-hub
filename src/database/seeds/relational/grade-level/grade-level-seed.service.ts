import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GradeLevelEntity } from 'src/grade-levels/entities/grade-level.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GradeLevelSeedService {
  constructor(
    @InjectRepository(GradeLevelEntity)
    private readonly GradeLevelRepository: Repository<GradeLevelEntity>,
  ) {}

  async run() {
    const count = await this.GradeLevelRepository.count();

    if (!count) {
      await this.GradeLevelRepository.save([
        this.GradeLevelRepository.create({
          name: 'Grade 1',
        }),
        this.GradeLevelRepository.create({
          name: 'Grade 2',
        }),
      ]);
    }
  }
}
