import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { SupabaseService } from '../supabase/supabase.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private supabaseService: SupabaseService,
    private storageService: StorageService,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    const { email, password, username } = registerUserDto;

    // 1. User in Supabase Auth erstellen
    const { data: authData, error: authError } = await this.supabaseService
      .getClient()
      .auth.signUp({
        email,
        password,
      });

    if (authError) {
      if (authError.message.includes('already registered')) {
        throw new ConflictException('E-Mail-Adresse bereits registriert');
      }
      throw new ConflictException(`1, ${authError.message}`);
    }

    if (!authData.user) {
      throw new ConflictException('User konnte nicht erstellt werden');
    }

    // 2. User in public.users Tabelle erstellen
    const user = await this.prisma.user.create({
      data: {
        id: authData.user.id,
        username,
      },
    });

    return {
      user,
      session: authData.session,
    };
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const { data, error } = await this.supabaseService
      .getClient()
      .auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      console.log(error)
      throw new UnauthorizedException('Ungültige Anmeldedaten');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: data.user.id },
    });

    return {
      access_token: data.session.access_token,
      user,
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async uploadAvatar(userId: string, file: Express.Multer.File) {
    await this.storageService.uploadAvatar(userId, file);
  }

  async getAvatar(userId: string) {
    return this.storageService.getAvatar(userId);
  }
}