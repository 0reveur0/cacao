import { Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AssignmentsService } from './assignments.service';

@Controller('api/assignments')
@UseGuards(AuthGuard('jwt'))
export class AssignmentsController {
  constructor(private assignmentsService: AssignmentsService) {}

  @Get()
  async getAssignments(@Request() req: any) {
    return this.assignmentsService.getAssignments(req.user.sub);
  }

  @Post(':id/submit')
  async submitAssignment(@Request() req: any, @Param('id') id: string) {
    return this.assignmentsService.submitAssignment(req.user.sub, id);
  }
}
