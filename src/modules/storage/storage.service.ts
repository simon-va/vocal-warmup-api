import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class StorageService {
  constructor(private supabaseService: SupabaseService) {}

  async uploadAvatar(
    userId: string,
    file: Express.Multer.File,
  ): Promise<string> {
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${userId}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await this.supabaseService
      .getAdminClient()
      .storage.from('avatars')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (uploadError) {
      throw new Error(`Upload fehlgeschlagen: ${uploadError.message}`);
    }

    const { data } = this.supabaseService
      .getAdminClient()
      .storage.from('avatars')
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  async deleteAvatar(avatarUrl: string): Promise<void> {
    // Extrahiere den Dateinamen aus der URL
    // URL Format: https://.../storage/v1/object/public/avatars/userid.jpg
    const urlParts = avatarUrl.split('/avatars/');
    if (urlParts.length < 2) return;

    const fileName = urlParts[1]; // nur der Dateiname (z.B. userid.jpg)

    const { error } = await this.supabaseService
      .getAdminClient()
      .storage.from('avatars')
      .remove([fileName]);

    if (error) {
      throw new Error(`Löschen fehlgeschlagen: ${error.message}`);
    }
  }
}
