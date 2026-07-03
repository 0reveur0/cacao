import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { LessonsModule } from './lessons/lessons.module';
import { ProgressModule } from './progress/progress.module';
import { DiscussionsModule } from './discussions/discussions.module';
import { FeedModule } from './feed/feed.module';
import { InstructorModule } from './instructor/instructor.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    DashboardModule,
    AssignmentsModule,
    LessonsModule,
    ProgressModule,
    DiscussionsModule,
    FeedModule,
    InstructorModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
