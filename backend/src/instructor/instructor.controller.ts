import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { InstructorService } from './instructor.service';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

class EvaluateSubmissionDto {
  @IsString({ message: 'feedback phai la chuoi ky tu' })
  @IsNotEmpty({ message: 'feedback la truong bat buoc' })
  feedback: string;

  @IsEnum(['MASTERED', 'REVISION_NEEDED'], { message: 'status phai la MASTERED hoac REVISION_NEEDED' })
  status: 'MASTERED' | 'REVISION_NEEDED';
}

@Controller('api/instructor')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InstructorController {
  constructor(private instructorService: InstructorService) {}

  @Get('submissions')
  @Roles('INSTRUCTOR', 'ADMIN')
  async getPendingSubmissions() {
    return this.instructorService.listPendingSubmissions();
  }

  @Post('submissions/:id/evaluate')
  @Roles('INSTRUCTOR', 'ADMIN')
  async evaluate(
    @Param('id') id: string,
    @Body() dto: EvaluateSubmissionDto,
  ) {
    return this.instructorService.evaluateSubmission(id, dto.feedback, dto.status);
  }
}
