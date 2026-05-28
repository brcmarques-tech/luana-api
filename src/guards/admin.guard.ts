import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const auth = req.headers['authorization'];
    const secret = process.env.ADMIN_SECRET;

    if (!secret || auth !== `Bearer ${secret}`) {
      throw new UnauthorizedException('Admin secret inválido');
    }
    return true;
  }
}
