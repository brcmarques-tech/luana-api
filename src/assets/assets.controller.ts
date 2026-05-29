import {
  Controller,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  BadRequestException,
  Get,
  Param,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { Response } from 'express';
import { existsSync } from 'fs';
import { AdminGuard } from '../guards/admin.guard';

const ALLOWED_AUDIO = ['.mp3', '.ogg', '.wav'];
const ALLOWED_IMG = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

@Controller('assets')
export class AssetsController {
  // upload: POST /assets/upload?type=audio ou ?type=img
  @Post('upload')
  @UseGuards(AdminGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, _file, cb) => {
          const type = req.query.type as string;
          if (type !== 'audio' && type !== 'img') {
            return cb(new BadRequestException('type deve ser audio ou img'), '');
          }
          cb(null, join(process.cwd(), 'assets', type));
        },
        filename: (_req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname).toLowerCase();
        const type = (req as any).query.type;
        const allowed = type === 'audio' ? ALLOWED_AUDIO : ALLOWED_IMG;
        if (!allowed.includes(ext)) {
          return cb(new BadRequestException(`Extensão ${ext} não permitida`), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
    }),
  )
  upload(@UploadedFile() file: Express.Multer.File, @Query('type') type: string) {
    return { ok: true, path: `/assets/${type}/${file.filename}` };
  }

  // verifica credenciais admin
  @Get('ping')
  @UseGuards(AdminGuard)
  ping() {
    return { ok: true };
  }

  // lista arquivos disponíveis (admin)
  @Get('list/:type')
  @UseGuards(AdminGuard)
  list(@Param('type') type: string) {
    if (type !== 'audio' && type !== 'img') {
      throw new BadRequestException('type deve ser audio ou img');
    }
    const { readdirSync } = require('fs');
    const dir = join(process.cwd(), 'assets', type);
    try {
      const files = readdirSync(dir);
      return { files: files.map((f) => `/assets/${type}/${f}`) };
    } catch {
      return { files: [] };
    }
  }
}
