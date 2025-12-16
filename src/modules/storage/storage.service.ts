import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class StorageService {
  constructor(private supabaseService: SupabaseService) {}

  async uploadAvatar(
    userId: string,
    file: Express.Multer.File,
  ): Promise<void> {
    const filePath = `avatars/${userId}`;

    const { error: uploadError } = await this.supabaseService
      .getAdminClient()
      .storage.from('public-bucket')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (uploadError) {
      throw new Error(`Upload fehlgeschlagen: ${uploadError.message}`);
    }
  }

  async getAvatar(userId: string): Promise<{ data: Blob; contentType: string } | null> {
    const filePath = `avatars/${userId}`;

    const { data, error } = await this.supabaseService
      .getAdminClient()
      .storage.from('public-bucket')
      .download(filePath);

    if (error) {
      return null;
    }

    return {
      data,
      contentType: data.type,
    };
  }
}
