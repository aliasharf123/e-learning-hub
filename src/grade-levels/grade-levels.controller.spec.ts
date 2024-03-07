import { Test, TestingModule } from '@nestjs/testing';
import { GradeLevelsController } from './grade-levels.controller';
import { GradeLevelsService } from './grade-levels.service';

describe('GradeLevelsController', () => {
  let controller: GradeLevelsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GradeLevelsController],
      providers: [GradeLevelsService],
    }).compile();

    controller = module.get<GradeLevelsController>(GradeLevelsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
