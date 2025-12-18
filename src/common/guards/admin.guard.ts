import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.id) {
      throw new UnauthorizedException('Kein authentifizierter Benutzer');
    }

    // Fetch user from database to check isAdmin status
    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: { isAdmin: true },
    });

    if (!dbUser) {
      throw new UnauthorizedException('Benutzer nicht gefunden');
    }

    if (!dbUser.isAdmin) {
      throw new ForbiddenException('Zugriff verweigert: Admin-Rechte erforderlich');
    }

    return true;
  }
}
