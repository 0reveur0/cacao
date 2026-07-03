import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  providers: [DashboardService, PrismaService],
  controllers: [DashboardController],
})
export class DashboardModule {}
