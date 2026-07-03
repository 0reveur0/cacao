import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DiscussionsService {
  constructor(private prisma: PrismaService) {}

  async getDiscussionById(discussionId: string) {
    const discussion = await this.prisma.discussion.findUnique({
      where: { id: discussionId },
      include: {
        replies: {
          include: {
            user: {
              select: { fullName: true },
            },
          },
        },
      },
    });

    if (!discussion) {
      throw new NotFoundException('Thảo luận không tồn tại');
    }

    return discussion;
  }
}
