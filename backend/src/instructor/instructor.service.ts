import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InstructorService {
  constructor(private prisma: PrismaService) {}

  async listPendingSubmissions() {
    return this.prisma.assignmentSubmission.findMany({
      where: { status: 'UNDER_REVIEW' },
      orderBy: { createdAt: 'desc' },
      include: {
        assignment: true,
        user: {
          select: { id: true, email: true, fullName: true, role: true },
        },
      },
    });
  }

  async evaluateSubmission(
    submissionId: string,
    feedback: string,
    status: 'MASTERED' | 'REVISION_NEEDED',
  ) {
    const existing = await this.prisma.assignmentSubmission.findUnique({
      where: { id: submissionId },
    });

    if (!existing) {
      throw new NotFoundException('Ban khong tim thay nop bai nay');
    }

    return this.prisma.assignmentSubmission.update({
      where: { id: submissionId },
      data: {
        status,
        feedbackText: feedback,
        evaluatedAt: new Date(),
      },
    });
  }
}
