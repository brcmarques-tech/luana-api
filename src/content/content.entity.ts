import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('luana_content')
export class ContentOverride {
  // chave: 'final', 'loves', 'puzzle', 'timeline', 'questions', 'reveal', 'card', 'bonusCards', 'specialCard'
  @PrimaryColumn()
  key: string;

  // valor completo do override (objeto ou array)
  @Column({ type: 'jsonb' })
  value: any;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
