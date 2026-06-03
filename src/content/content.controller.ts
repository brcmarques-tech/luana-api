import { Body, Controller, Delete, Get, Param, Put, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../guards/admin.guard';
import { ContentService } from './content.service';

@Controller('content')
export class ContentController {
  constructor(private readonly service: ContentService) {}

  // público: lê todos overrides (frontend usa no boot)
  @Get()
  getAll() {
    return this.service.getAll();
  }

  // admin: salva/atualiza override pra uma chave
  @Put(':key')
  @UseGuards(AdminGuard)
  set(@Param('key') key: string, @Body() body: { value: any }) {
    return this.service.set(key, body.value);
  }

  // admin: reseta uma chave (volta pro default)
  @Delete(':key')
  @UseGuards(AdminGuard)
  delete(@Param('key') key: string) {
    return this.service.delete(key);
  }

  // admin: reseta TUDO
  @Delete()
  @UseGuards(AdminGuard)
  deleteAll() {
    return this.service.deleteAll();
  }
}
