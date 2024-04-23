import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class QueryOptionsSubjectDto {
  @ApiProperty({
    description: 'Search query',
    example: 'Mathematics',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Grade level id',
    example: 1,
    required: false,
  })
  @IsOptional()
  gradeLevelId?: number;

  @ApiProperty({
    description: 'Include lectures',
    example: true,
    required: false,
  })
  includeLessons?: boolean;
}
