import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'email phai la dia chi email hop le' })
  @IsNotEmpty({ message: 'email la truong bat buoc' })
  email: string;

  @IsNotEmpty({ message: 'password la truong bat buoc' })
  @MinLength(6, { message: 'password phai co it nhat 6 ky tu' })
  password: string;
}
