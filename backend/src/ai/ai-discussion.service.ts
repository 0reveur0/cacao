import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ContextRetrieverService } from './context-retriever.service';
import { buildDiscussionAssistantPrompt } from './templates/prompt-templates';

@Injectable()
export class AiDiscussionService {
  constructor(
    private prisma: PrismaService,
    private contextRetriever: ContextRetrieverService,
  ) {}

  async generateDiscussionReply(userId: string, discussionId: string, lessonId?: string) {
    const discussion = await this.prisma.discussion.findUnique({
      where: { id: discussionId },
      include: {
        replies: {
          include: {
            user: {
              select: {
                fullName: true,
              },
            },
          },
        },
      },
    });

    if (!discussion) {
      throw new NotFoundException('Thảo luận không tồn tại');
    }

    const previousReplies = discussion.replies.length
      ? discussion.replies
          .map((reply) => `- ${reply.user.fullName}: ${reply.content}`)
          .join('\n')
      : '';

    const lessonContext = lessonId
      ? await this.contextRetriever.getLessonContext(lessonId, userId)
      : null;

    const prompt = buildDiscussionAssistantPrompt({
      context: lessonContext?.markdown ?? '',
      discussionTitle: discussion.title,
      discussionContent: discussion.content,
      previousReplies,
    });

    const aiContent = await this.generateTextFromLlm(prompt);

    return this.prisma.discussionReply.create({
      data: {
        discussionId,
        userId,
        content: aiContent,
        isAiResponse: true,
      },
    });
  }

  private async generateTextFromLlm(prompt: string) {
    const gatewayUrl = process.env.LLM_GATEWAY_URL?.trim() || 'http://127.0.0.1:11434';
    const model = process.env.LLM_MODEL_NAME?.trim() || 'llama2';

    const response = await (globalThis as any).fetch(`${gatewayUrl}/v1/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        input: prompt,
        temperature: 0.2,
        max_tokens: 600,
      }),
    });

    if (!response.ok) {
      const bodyText = await response.text();
      throw new InternalServerErrorException(
        `Không thể gọi dịch vụ LLM: ${response.status} ${response.statusText} - ${bodyText}`,
      );
    }

    const result = await response.json();
    const content =
      result?.choices?.[0]?.message?.content ||
      result?.choices?.[0]?.text ||
      result?.output?.[0] ||
      result?.result?.output?.[0] ||
      '';

    if (!content || typeof content !== 'string') {
      throw new InternalServerErrorException('Phản hồi từ LLM không có nội dung hợp lệ');
    }

    return content.trim();
  }
}
