import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  async verifyQuizSubmission(userId: string, lessonId: string, answers: number[]) {
    const quiz = await this.prisma.milestoneQuiz.findUnique({
      where: { lessonId },
    });

    if (!quiz) {
      throw new BadRequestException('Bai trac nghiem khong ton tai');
    }

    const questionList = quiz.questions as Array<{ correctIndex: number }>;
    if (!Array.isArray(questionList) || questionList.length === 0) {
      throw new BadRequestException('Du lieu cau hoi khong hop le');
    }

    const correctCount = questionList.reduce((count, question, index) => {
      if (answers[index] === question.correctIndex) return count + 1;
      return count;
    }, 0);

    const finalScore = Math.round((correctCount / questionList.length) * 100);
    const passed = finalScore >= 80;

    await this.prisma.userProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      update: {
        score: finalScore,
        completed: passed,
      },
      create: {
        userId,
        lessonId,
        score: finalScore,
        completed: passed,
      },
    });

    if (passed) {
      const currentLesson = await this.prisma.lesson.findUnique({
        where: { id: lessonId },
      });

      if (currentLesson) {
        const nextLesson = await this.prisma.lesson.findFirst({
          where: {
            courseId: currentLesson.courseId,
            sequence: currentLesson.sequence + 1,
          },
        });

        if (nextLesson) {
          await this.prisma.userProgress.upsert({
            where: { userId_lessonId: { userId, lessonId: nextLesson.id } },
            update: {},
            create: {
              userId,
              lessonId: nextLesson.id,
              score: 0,
              completed: false,
            },
          });
        }
      }
    }

    return { score: finalScore, passed };
  }
}
