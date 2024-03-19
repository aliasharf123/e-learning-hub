import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanEntity } from 'src/plan/entities/plan.entity';
import { PlanSeedService } from './plan-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([PlanEntity])],
  providers: [PlanSeedService],
  exports: [PlanSeedService],
})
export class PlanSeedModule {}
