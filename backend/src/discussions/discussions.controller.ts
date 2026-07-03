import { Body, Controller, Param, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AiDiscussionService } from '../ai/ai-discussion.service';
import { CreateAiReplyDto } from './dto/create-ai-reply.dto';

@Controller('api/discussions')
@UseGuards(JwtAuthGuard)
export class DiscussionsController {
  constructor(private aiDiscussionService: AiDiscussionService) {}

  @Post(':discussionId/ai-reply')
  async generateAiReply(
    @Request() req: any,
    @Param('discussionId') discussionId: string,
    @Body() dto: CreateAiReplyDto,
  ) {
    return this.aiDiscussionService.generateDiscussionReply(
      req.user.id,
      discussionId,
      dto.lessonId,
    );
  }
}
