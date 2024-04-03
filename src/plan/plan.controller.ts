import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { QueryPlanDto } from './dto/query-plan.dto';
import { PlanEntity } from './entities/plan.entity';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { infinityPagination } from 'src/utils/infinity-pagination';
import { QuerySortDto } from 'src/common/dto/query-sort.dto';
import { QueryPaginationDto } from 'src/common/dto/qyery-pagination.dto';
import { NullableType } from 'src/utils/types/nullable.type';

@ApiTags('Plan')
@Controller('plan')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  /**
   * Create a new plan.
   * @param createPlanDto The data for creating the plan.
   * @param subjectId The ID of the subject to which the plan belongs.
   * @returns The created plan.
   */
  @Post('/subject/:subjectId')
  @ApiOperation({ summary: 'Create a new plan' })
  @ApiCreatedResponse({ description: 'The created plan', type: CreatePlanDto })
  create(
    @Body() createPlanDto: CreatePlanDto,
    @Param('subjectId') subjectId: number,
  ) {
    return this.planService.create(createPlanDto, subjectId);
  }

  /**
   * Retrieve all plans with pagination.
   * @param queryPlanDto The query parameters for retrieving plans.
   * @param querySortDto The sorting options for the retrieved plans.
   * @param queryPaginationDto The pagination options for the retrieved plans.
   * @returns The list of plans with pagination.
   */
  @Get()
  @ApiOperation({ summary: 'Retrieve all plans with pagination' })
  @ApiCreatedResponse({
    description: 'The list of plans with pagination',
  })
  async findAll(
    @Query() queryPlanDto: QueryPlanDto,
    @Query() querySortDto: QuerySortDto<PlanEntity>,
    @Query() queryPaginationDto: QueryPaginationDto,
  ): Promise<InfinityPaginationResultType<PlanEntity>> {
    const page = queryPaginationDto?.page ?? 1;
    let limit = queryPaginationDto?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.planService.findManyWithPagination({
        paginationOptions: { page, limit },
        filterOptions: queryPlanDto?.filters,
        sortOptions: querySortDto?.sort,
      }),
      { page, limit },
    );
  }

  /**
   * Get a plan by ID.
   * @param id The ID of the plan.
   * @returns The plan with the specified ID.
   */
  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOperation({ summary: 'Get a plan by ID' })
  findOne(@Param('id') id: number): Promise<NullableType<PlanEntity>> {
    return this.planService.findOne(id);
  }

  /**
   * Update a plan.
   * @param id The ID of the plan to update.
   * @param updatePlanDto The data for updating the plan.
   * @returns The updated plan.
   */
  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOperation({ summary: 'Update plan by ID' })
  update(@Param('id') id: number, @Body() updatePlanDto: UpdatePlanDto) {
    return this.planService.update(id, updatePlanDto);
  }

  /**
   * Delete a plan.
   * @param id The ID of the plan to delete.
   * @returns The deleted plan.
   */
  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOperation({ summary: 'Soft delete plan by ID' })
  remove(@Param('id') id: number) {
    return this.planService.softDelete(id);
  }
}
