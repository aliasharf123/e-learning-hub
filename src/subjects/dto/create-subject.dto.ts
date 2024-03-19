import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { FileDto } from 'src/files/dto/file.dto';

export class CreateSubjectDto {
  @ApiProperty({
    description: 'Name of the subject',
    example: 'Mathematics',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Description of the subject',
    example: 'Mathematics subject',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Grade level id',
    example: 1,
  })
  @IsNotEmpty()
  gradeLevelId: number;

  @ApiProperty({
    description: 'Photo of the subject',
    type: () => FileDto,
  })
  @IsOptional()
  // @Transform(() => FileEntity)
  @ValidateNested({ each: true })
  photo?: FileDto | null;
}
