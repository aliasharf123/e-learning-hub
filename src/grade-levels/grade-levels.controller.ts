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
import { GradeLevelsService } from './grade-levels.service';
import { CreateGradeLevelDto } from './dto/create-grade-level.dto';
import { UpdateGradeLevelDto } from './dto/update-grade-level.dto';
import { GradeLevelEntity } from './entities/grade-level.entity';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { QueryGradeLevelDto } from './dto/query-grade-level.dto';
import { infinityPagination } from 'src/utils/infinity-pagination';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Grade Levels')
@Controller('grade-levels')
export class GradeLevelsController {
  constructor(private readonly gradeLevelsService: GradeLevelsService) {}

  @Post()
  create(@Body() createGradeLevelDto: CreateGradeLevelDto) {
    return this.gradeLevelsService.create(createGradeLevelDto);
  }

  @Get()
  async findAll(
    @Query() query: QueryGradeLevelDto,
  ): Promise<InfinityPaginationResultType<GradeLevelEntity>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }
    return infinityPagination(
      await this.gradeLevelsService.findManyWithPagination({
        paginationOptions: { page, limit },
      }),
      { page, limit },
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gradeLevelsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGradeLevelDto: UpdateGradeLevelDto,
  ) {
    return this.gradeLevelsService.update(+id, updateGradeLevelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gradeLevelsService.remove(+id);
  }
}
