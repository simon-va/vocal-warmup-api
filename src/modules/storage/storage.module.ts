import { Module } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { StorageService } from './storage.service';

@Module({
  providers: [StorageService, SupabaseService],
  exports: [StorageService],
})
export class StorageModule {}
