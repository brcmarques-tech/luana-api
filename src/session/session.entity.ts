import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('luana_sessions')
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  token: string;

  // qual aniversário: 1, 2, 3...
  @Column({ default: 1 })
  year: number;

  // null até ela abrir pela primeira vez
  @Column({ name: 'first_access', type: 'timestamptz', nullable: true })
  firstAccess: Date | null;

  @Column({ name: 'last_access', type: 'timestamptz', nullable: true })
  lastAccess: Date | null;

  @Column({ default: 0 })
  xp: number;

  @Column({ default: 1 })
  level: number;

  @Column({ type: 'jsonb', default: [] })
  achievements: string[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
