import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContentOverride } from './content.entity';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(ContentOverride)
    private readonly repo: Repository<ContentOverride>,
  ) {}

  // retorna todos overrides como objeto { [key]: value }
  async getAll(): Promise<Record<string, any>> {
    const rows = await this.repo.find();
    const out: Record<string, any> = {};
    for (const row of rows) out[row.key] = row.value;
    return out;
  }

  async set(key: string, value: any): Promise<{ ok: true }> {
    const existing = await this.repo.findOne({ where: { key } });
    if (existing) {
      existing.value = value;
      await this.repo.save(existing);
    } else {
      await this.repo.save(this.repo.create({ key, value }));
    }
    return { ok: true };
  }

  async delete(key: string): Promise<{ ok: true }> {
    await this.repo.delete({ key });
    return { ok: true };
  }

  async deleteAll(): Promise<{ ok: true }> {
    await this.repo.clear();
    return { ok: true };
  }
}
