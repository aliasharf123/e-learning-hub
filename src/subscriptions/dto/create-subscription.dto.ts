import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive } from 'class-validator';
import { SubjectEntity } from 'src/subjects/entities/subject.entity';
import { User } from 'src/users/domain/user';

export class CreateSubscriptionDto {
  @ApiProperty({
    example: 1,
    description: 'The user id',
  })
  @IsNotEmpty()
  studentId: User['id'];

  @ApiProperty({
    example: 1,
    description: 'The subject id',
  })
  @IsNotEmpty()
  subjectId: SubjectEntity['id'];

  @ApiProperty({
    example: 1,
    description: 'The duration in months',
  })
  @IsNotEmpty()
  @IsPositive()
  durationInMonths: number;

  // @ApiProperty({
  //   example: '2024-01-01T00:00:00.000Z',
  //   description: 'The start date timestamp',
  // })
  // startDate: Date;

  // @ApiProperty({
  //   example: '2024-12-31T23:59:59.999Z',
  //   description: 'The end date timestamp',
  // })
  // endDate: Date;

  // @ApiProperty({
  //   example: false,
  //   description: 'The cancel status',
  // })
  // isCanceled: boolean;
}
