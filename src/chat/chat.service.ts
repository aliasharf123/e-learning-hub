import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@Injectable()
export class ChatService {
  create(createChatDto: CreateChatDto) {
    console.log(createChatDto);
    return 'This action adds a new chat';
  }

  findAll() {
    return `This action returns all chat`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chat`;
  }

  update(id: number, updateChatDto: UpdateChatDto) {
    console.log(updateChatDto);
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
