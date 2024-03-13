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
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { QueryPaginationDto } from 'src/common/dto/qyery-pagination.dto';
import { infinityPagination } from 'src/utils/infinity-pagination';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { SubjectEntity } from './entities/subject.entity';
import { ApiTags } from '@nestjs/swagger';
import { QueryOptionsDto } from './dto/query-options.dto';

@ApiTags('Subject')
@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post()
  create(@Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectsService.create(createSubjectDto);
  }

  @Get()
  async findManyWithPagination(
    @Query() query: QueryPaginationDto,
    @Query() queryOptions: QueryOptionsDto,
  ): Promise<InfinityPaginationResultType<SubjectEntity>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }
    return infinityPagination(
      await this.subjectsService.findManyWithPagination(
        {
          paginationOptions: { page, limit },
        },
        queryOptions,
      ),
      { page, limit },
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subjectsService.findOne({ id: +id });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubjectDto: UpdateSubjectDto) {
    return this.subjectsService.updateSubject(+id, updateSubjectDto);
  }

  @Delete(':id')
  softDelete(@Param('id') id: string) {
    return this.subjectsService.softDelete(+id);
  }
}
