import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProgressController } from './progress.controller';
import { ProgressService } from './progress.service';

@Module({
  providers: [ProgressService, PrismaService],
  controllers: [ProgressController],
})
export class ProgressModule {}
