import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaService } from '../prisma/prisma.service';
import { AiDiscussionService } from '../ai/ai-discussion.service';
import { ContextRetrieverService } from '../ai/context-retriever.service';
import { DiscussionsController } from './discussions.controller';
import { DiscussionsService } from './discussions.service';

@Module({
  imports: [AuthModule],
  providers: [DiscussionsService, AiDiscussionService, ContextRetrieverService, PrismaService],
  controllers: [DiscussionsController],
})
export class DiscussionsModule {}
