import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProgressService } from './progress.service';

@Controller('api/progress')
@UseGuards(AuthGuard('jwt'))
export class ProgressController {
  constructor(private progressService: ProgressService) {}

  @Post('verify')
  async verify(@Request() req: any, @Body() body: { lessonId: string; answers: number[] }) {
    return this.progressService.verifyQuizSubmission(req.user.sub, body.lessonId, body.answers);
  }
}
