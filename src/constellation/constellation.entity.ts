import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('luana_constellation_answers')
@Unique(['sessionToken', 'day'])
export class ConstellationAnswer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'session_token' })
  sessionToken: string;

  // 1..7
  @Column()
  day: number;

  // a/b/c/d ou null para texto-livre puro
  @Column({ name: 'option_id', type: 'varchar', length: 8, nullable: true })
  optionId: string | null;

  // texto livre opcional (dias 6 e 7 são só texto)
  @Column({ type: 'text', default: '' })
  text: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
