import { IsOptional, IsString } from 'class-validator';

export class CreateAiReplyDto {
  @IsOptional()
  @IsString()
  lessonId?: string;
}
