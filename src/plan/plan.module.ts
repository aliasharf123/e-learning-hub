import { Module } from '@nestjs/common';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanEntity } from './entities/plan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PlanEntity])],
  controllers: [PlanController],
  providers: [PlanService],
  exports: [PlanService],
})
export class PlanModule {}
