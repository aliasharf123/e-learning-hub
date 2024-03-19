import { NestFactory } from '@nestjs/core';
import { RoleSeedService } from './role/role-seed.service';
import { SeedModule } from './seed.module';
import { StatusSeedService } from './status/status-seed.service';
import { UserSeedService } from './user/user-seed.service';
import { PlanSeedService } from './plan/plan-seed.service';
import { SubjectSeedService } from './subject/subject-seed.service';
import { GradeLevelSeedService } from './grade-level/grade-level-seed.service';

const runSeed = async () => {
  const app = await NestFactory.create(SeedModule);

  // run
  await app.get(RoleSeedService).run();
  await app.get(StatusSeedService).run();
  await app.get(UserSeedService).run();
  await app.get(GradeLevelSeedService).run();
  await app.get(SubjectSeedService).run();
  await app.get(PlanSeedService).run();
  await app.close();
};

void runSeed();
