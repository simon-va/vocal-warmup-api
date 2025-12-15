import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../../modules/supabase/supabase.service';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(private supabaseService: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Kein Token vorhanden');
    }

    const token = authHeader.substring(7);

    try {
      const user = await this.supabaseService.verifyToken(token);
      request.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Ungültiger Token');
    }
  }
}