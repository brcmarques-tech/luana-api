import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ConstellationService } from './constellation.service';
import { SaveAnswerDto } from './dto/save-answer.dto';

@Controller('constellation')
export class ConstellationController {
  constructor(private readonly service: ConstellationService) {}

  // cliente: lê estado (respostas, dia atual, se pode responder, etc.)
  @Get(':token')
  getState(@Param('token') token: string) {
    return this.service.getState(token);
  }

  // cliente: salva a resposta do dia
  @Post(':token/answer')
  saveAnswer(@Param('token') token: string, @Body() dto: SaveAnswerDto) {
    return this.service.saveAnswer(token, dto);
  }
}
