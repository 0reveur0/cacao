import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getSummary(userId: string) {
    const active = await this.prisma.userProgress.count({
      where: { userId, completed: false },
    });

    const completed = await this.prisma.userProgress.count({
      where: { userId, completed: true },
    });

    const currentTopic = await this.prisma.userProgress.findFirst({
      where: { userId, completed: false },
      orderBy: { unlockedAt: 'desc' },
      include: { lesson: { select: { title: true } } },
    });

    const courses = await this.prisma.userProgress.findMany({
      where: { userId },
      include: { lesson: { select: { title: true } } },
      orderBy: { unlockedAt: 'desc' },
      take: 6,
    });

    return {
      activeCourses: active,
      completedCourses: completed,
      currentTopic: currentTopic?.lesson?.title ?? null,
      courses: courses.map((progress) => ({
        id: progress.lessonId,
        title: progress.lesson.title,
        status: progress.completed ? 'completed' : 'active',
        lastAccessed: progress.updatedAt.toISOString(),
      })),
    };
  }
}
