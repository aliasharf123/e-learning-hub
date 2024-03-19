import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlanEntity } from 'src/plan/entities/plan.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PlanSeedService {
  constructor(
    @InjectRepository(PlanEntity)
    private readonly planRepository: Repository<PlanEntity>,
  ) {}
  async run() {
    const count = await this.planRepository.count();

    if (!count) {
      await this.planRepository.save([
        this.planRepository.create({
          name: 'Basic',
          cost: 100,
          subjectId: 1,
          description: 'Basic plan',
          durationInMonths: 6,
          endDate: new Date('2024-03-15'),
        }),
        this.planRepository.create({
          name: 'Premium',
          cost: 200,
          subjectId: 1,
          description: 'Premium plan',
          durationInMonths: 12,
          endDate: new Date('2024-03-15'),
        }),
      ]);
    }
  }
}
