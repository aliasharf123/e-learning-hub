import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PlanEntity } from './entities/plan.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { SortDto } from 'src/common/dto/query-sort.dto';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { SubjectEntity } from 'src/subjects/entities/subject.entity';

@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(PlanEntity)
    private readonly planRepository: Repository<PlanEntity>,
    @InjectRepository(SubjectEntity)
    private readonly subjectRepository: Repository<SubjectEntity>,
  ) {}

  /**
   * Creates a new plan.
   *
   * @param createPlanDto - The data transfer object containing the details of the plan to be created.
   * @param subjectId - The ID of the subject associated with the plan.
   * @returns A promise that resolves to the newly created plan.
   */
  async create(createPlanDto: CreatePlanDto, subjectId: number) {
    try {
      const subject = await this.subjectRepository.findOne({
        where: { id: subjectId },
      });

      if (!subject) {
        throw new ForbiddenException('Subject not found');
      }

      const createdPlan = await this.planRepository.save(
        this.planRepository.create({ ...createPlanDto, subjectId }),
      );
      return createdPlan;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: any | null;
    sortOptions?: SortDto<PlanEntity>[] | null;
    paginationOptions: IPaginationOptions;
  }) {
    const entities = await this.planRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      where: filterOptions as FindOptionsWhere<PlanEntity>,
      order: sortOptions?.reduce(
        (accumulator, sort) => ({
          ...accumulator,
          [sort.orderBy]: sort.order,
        }),
        {},
      ),
    });
    return entities;
  }

  async findOne(id: number) {
    const plan = await this.planRepository.findOne({
      where: { id },
    });
    if (!plan) {
      throw new NotFoundException('Plan not found');
    }
    return plan;
  }

  async update(id: number, updatePlanDto: UpdatePlanDto) {
    const updatedPlan = await this.planRepository.update(id, updatePlanDto);

    if (updatedPlan.affected === 0) {
      throw new NotFoundException('Plan not found');
    }

    const plan = await this.planRepository.findOne({ where: { id } });
    return plan;
  }

  async softDelete(id: number): Promise<void> {
    try {
      const result = await this.planRepository.softDelete(id);
      if (result.affected === 0) {
        throw new NotFoundException('Plan not found');
      }
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
}
