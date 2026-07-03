import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: unknown, user: unknown, _info: unknown) {
    if (err || !user) {
      throw new UnauthorizedException('Phien dang nhap het han hoặc khong hop le');
    }
    return user;
  }
}
