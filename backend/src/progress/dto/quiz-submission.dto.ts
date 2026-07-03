import { Type } from 'class-transformer';
import { ArrayNotEmpty, ArrayMinSize, IsArray, IsInt, IsOptional } from 'class-validator';

export class QuizSubmissionDto {
  @IsArray()
  @ArrayNotEmpty({ message: 'answers khong duoc de trong' })
  @ArrayMinSize(1, { message: 'answers phai chua it nhat mot phan tu' })
  @Type(() => Number)
  @IsInt({ each: true, message: 'Moi phan tu answers phai la mot so nguyen' })
  answers: number[];
}
