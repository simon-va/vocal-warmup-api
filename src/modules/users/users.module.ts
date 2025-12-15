import { Module } from '@nestjs/common';
import { StorageModule } from '../storage/storage.module';
import { SupabaseService } from '../supabase/supabase.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [StorageModule],
  controllers: [UsersController],
  providers: [UsersService, SupabaseService],
})
export class UsersModule {}