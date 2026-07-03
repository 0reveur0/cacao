import { IsNotEmpty, IsString } from 'class-validator';

export class AssignmentSubmissionDto {
  @IsString({ message: 'fileUrl phai la chuoi ky tu hop le' })
  @IsNotEmpty({ message: 'fileUrl la truong bat buoc' })
  fileUrl: string;
}
