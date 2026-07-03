import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AssignmentsService {
  constructor(private prisma: PrismaService) {}

  async getAssignments(userId: string) {
    const submissions = await this.prisma.assignmentSubmission.findMany({
      where: { userId },
      include: { assignment: true },
    });

    return {
      assignments: submissions.map((submission) => ({
        id: submission.assignmentId,
        title: submission.assignment.title,
        status: submission.status.toLowerCase(),
        due: submission.assignment.dueDate?.toISOString() ?? null,
        feedback: submission.feedbackText,
      })),
    };
  }

  async submitAssignment(userId: string, assignmentId: string) {
    const existing = await this.prisma.assignmentSubmission.findUnique({
      where: { userId_assignmentId: { userId, assignmentId } },
    });

    if (existing) {
      return this.prisma.assignmentSubmission.update({
        where: { id: existing.id },
        data: { status: 'UNDER_REVIEW' },
      });
    }

    return this.prisma.assignmentSubmission.create({
      data: {
        assignmentId,
        userId,
        fileUrl: '/uploads/sample.pdf',
        status: 'UNDER_REVIEW',
      },
    });
  }
}
