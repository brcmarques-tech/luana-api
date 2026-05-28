import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../guards/admin.guard';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { SessionService } from './session.service';

@Controller('session')
export class SessionController {
  constructor(private readonly service: SessionService) {}

  // admin: cria sessão e devolve token
  @Post()
  @UseGuards(AdminGuard)
  create(@Query('year') year?: string) {
    return this.service.create(year ? parseInt(year, 10) : 1);
  }

  // cliente: lê estado (hasAccess, XP, conquistas, dias restantes)
  @Get(':token')
  getState(@Param('token') token: string) {
    return this.service.getState(token);
  }

  // cliente: salva progresso
  @Put(':token/progress')
  updateProgress(@Param('token') token: string, @Body() dto: UpdateProgressDto) {
    return this.service.updateProgress(token, dto);
  }
}
