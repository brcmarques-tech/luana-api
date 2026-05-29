import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConstellationAnswer } from './constellation.entity';
import { Session } from '../session/session.entity';
import { ConstellationController } from './constellation.controller';
import { ConstellationService } from './constellation.service';

@Module({
  imports: [TypeOrmModule.forFeature([ConstellationAnswer, Session])],
  controllers: [ConstellationController],
  providers: [ConstellationService],
})
export class ConstellationModule {}
