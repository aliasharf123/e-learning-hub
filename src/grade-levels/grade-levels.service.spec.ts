import { Test, TestingModule } from '@nestjs/testing';
import { GradeLevelsService } from './grade-levels.service';

describe('GradeLevelsService', () => {
  let service: GradeLevelsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GradeLevelsService],
    }).compile();

    service = module.get<GradeLevelsService>(GradeLevelsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
