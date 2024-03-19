import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GradeLevelEntity } from 'src/grade-levels/entities/grade-level.entity';
import { GradeLevelSeedService } from './grade-level-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([GradeLevelEntity])],
  providers: [GradeLevelSeedService],
  exports: [GradeLevelSeedService],
})
export class GradeLevelSeedModule {}
