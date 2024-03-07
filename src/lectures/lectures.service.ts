import { Injectable } from '@nestjs/common';
import { CreateLectureDto } from './dto/create-lecture.dto';
import { UpdateLectureDto } from './dto/update-lecture.dto';

@Injectable()
export class LecturesService {
  create(createLectureDto: CreateLectureDto) {
    console.log('createLectureDto', createLectureDto);
    return 'This action adds a new lecture';
  }

  findAll() {
    return `This action returns all lectures`;
  }

  findOne(id: number) {
    return `This action returns a #${id} lecture`;
  }

  update(id: number, updateLectureDto: UpdateLectureDto) {
    console.log('updateLectureDto', updateLectureDto);
    return `This action updates a #${id} lecture`;
  }

  remove(id: number) {
    return `This action removes a #${id} lecture`;
  }
}
