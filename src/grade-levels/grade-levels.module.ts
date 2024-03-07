import { Module } from '@nestjs/common';
import { GradeLevelsService } from './grade-levels.service';
import { GradeLevelsController } from './grade-levels.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GradeLevelEntity } from './entities/grade-level.entity';
import { GradeLevelRepository } from './grade-level.repository';

@Module({
  imports: [TypeOrmModule.forFeature([GradeLevelEntity])],
  controllers: [GradeLevelsController],
  providers: [GradeLevelsService, GradeLevelRepository],
  exports: [GradeLevelsService],
})
export class GradeLevelsModule {}
