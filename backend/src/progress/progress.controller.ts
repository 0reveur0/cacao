import { Body, Controller, Param, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProgressService } from './progress.service';
import { QuizSubmissionDto } from './dto/quiz-submission.dto';

@Controller('api/progress')
@UseGuards(JwtAuthGuard)
export class ProgressController {
  constructor(private progressService: ProgressService) {}

  @Post('verify/:lessonId')
  async verify(
    @Request() req: any,
    @Param('lessonId') lessonId: string,
    @Body() body: QuizSubmissionDto,
  ) {
    return this.progressService.verifyQuizSubmission(req.user.id, lessonId, body.answers);
  }
}
