import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Session } from './session.entity';
import { UpdateProgressDto } from './dto/update-progress.dto';

@Injectable()
export class SessionService {
  private readonly accessDays: number;

  constructor(
    @InjectRepository(Session)
    private readonly repo: Repository<Session>,
  ) {
    this.accessDays = parseInt(process.env.ACCESS_DAYS ?? '7', 10);
  }

  async create(year = 1): Promise<{ token: string }> {
    const session = this.repo.create({ token: uuidv4(), year });
    await this.repo.save(session);
    return { token: session.token };
  }

  async getState(token: string) {
    const session = await this.repo.findOne({ where: { token } });
    if (!session) throw new NotFoundException('Sessão não encontrada');

    const now = new Date();

    // registra primeiro acesso
    if (!session.firstAccess) {
      session.firstAccess = now;
    }
    session.lastAccess = now;
    await this.repo.save(session);

    const accessMs = this.accessDays * 24 * 60 * 60 * 1000;
    const elapsed = now.getTime() - session.firstAccess.getTime();
    const hasAccess = elapsed < accessMs;
    const daysRemaining = Math.max(0, Math.ceil((accessMs - elapsed) / 86400000));
    const nextUnlock = new Date('2027-06-17T00:00:00-03:00').getTime();

    return {
      hasAccess,
      daysRemaining,
      nextUnlock: hasAccess ? null : nextUnlock,
      year: session.year,
      xp: session.xp,
      level: session.level,
      achievements: session.achievements,
    };
  }

  async updateProgress(token: string, dto: UpdateProgressDto) {
    const session = await this.repo.findOne({ where: { token } });
    if (!session) throw new NotFoundException('Sessão não encontrada');

    if (dto.xp !== undefined) session.xp = dto.xp;
    if (dto.level !== undefined) session.level = dto.level;
    if (dto.achievements !== undefined) session.achievements = dto.achievements;

    await this.repo.save(session);
    return { ok: true };
  }
}
