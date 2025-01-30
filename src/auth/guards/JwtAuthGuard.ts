import { JwtService } from '@nestjs/jwt';
import { UserService } from '@/src/users/user.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token);
      const user: any = await this.userService.getUserById(payload.userId);
      request.user = user.dataValues;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
    return true;
  }
}
