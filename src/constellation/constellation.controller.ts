import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ConstellationService } from './constellation.service';
import { SaveAnswerDto } from './dto/save-answer.dto';
import { AdminGuard } from '../guards/admin.guard';

@Controller('constellation')
export class ConstellationController {
  constructor(private readonly service: ConstellationService) {}

  // admin: todas as respostas de todas as sessões
  @Get('admin/all')
  @UseGuards(AdminGuard)
  getAllAnswers() {
    return this.service.getAllAnswers();
  }

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
