import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InstructorController } from './instructor.controller';
import { InstructorService } from './instructor.service';

@Module({
  providers: [InstructorService, PrismaService],
  controllers: [InstructorController],
})
export class InstructorModule {}
