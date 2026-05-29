import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConstellationAnswer } from './constellation.entity';
import { Session } from '../session/session.entity';
import { SaveAnswerDto } from './dto/save-answer.dto';

const DAY_MS = 24 * 60 * 60 * 1000;
const TOTAL_DAYS = 7;

@Injectable()
export class ConstellationService {
  constructor(
    @InjectRepository(ConstellationAnswer)
    private readonly answersRepo: Repository<ConstellationAnswer>,
    @InjectRepository(Session)
    private readonly sessionsRepo: Repository<Session>,
  ) {}

  private currentDay(firstAccess: Date | null): number {
    if (!firstAccess) return 1;
    const diff = Date.now() - firstAccess.getTime();
    return Math.min(TOTAL_DAYS, Math.max(1, Math.floor(diff / DAY_MS) + 1));
  }

  async getState(token: string) {
    const session = await this.sessionsRepo.findOne({ where: { token } });
    if (!session) throw new NotFoundException('Sessão não encontrada');

    const answers = await this.answersRepo.find({
      where: { sessionToken: token },
      order: { day: 'ASC' },
    });

    // formato { [day]: { optionId, text, ts } } pra casar com o frontend
    const byDay: Record<number, { optionId: string | null; text: string; ts: number }> = {};
    for (const a of answers) {
      byDay[a.day] = {
        optionId: a.optionId,
        text: a.text,
        ts: a.createdAt.getTime(),
      };
    }

    const day = this.currentDay(session.firstAccess);
    const todayAnswered = Boolean(byDay[day]);
    const canAnswerToday = day >= 1 && day <= TOTAL_DAYS && !todayAnswered;
    const complete = Object.keys(byDay).length >= TOTAL_DAYS;

    return {
      answers: byDay,
      firstAccess: session.firstAccess ? session.firstAccess.getTime() : null,
      day,
      answered: Object.keys(byDay).length,
      canAnswerToday,
      todayAnswered,
      complete,
    };
  }

  async saveAnswer(token: string, dto: SaveAnswerDto) {
    const session = await this.sessionsRepo.findOne({ where: { token } });
    if (!session) throw new NotFoundException('Sessão não encontrada');

    if (!session.firstAccess) {
      // primeira ação: registra o início pra contagem dos dias
      session.firstAccess = new Date();
      await this.sessionsRepo.save(session);
    }

    const currentDay = this.currentDay(session.firstAccess);
    if (dto.day !== currentDay) {
      throw new BadRequestException(
        `Você só pode responder a pergunta do dia atual (${currentDay}).`,
      );
    }

    if ((dto.text ?? '').trim().length === 0 && !dto.optionId) {
      throw new BadRequestException('Resposta vazia.');
    }

    const existing = await this.answersRepo.findOne({
      where: { sessionToken: token, day: dto.day },
    });
    if (existing) {
      throw new ConflictException('Já respondida hoje. Volte amanhã.');
    }

    const answer = this.answersRepo.create({
      sessionToken: token,
      day: dto.day,
      optionId: dto.optionId ?? null,
      text: dto.text ?? '',
    });
    await this.answersRepo.save(answer);

    return this.getState(token);
  }
}
