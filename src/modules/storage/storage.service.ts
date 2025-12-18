import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

export type MediaFolder = 'videos' | 'audios' | 'images';

export interface MediaData {
  data: Blob;
  contentType: string;
}

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

  async getAvatar(userId: string): Promise<MediaData | null> {
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

  async uploadExerciseMedia(
    folder: MediaFolder,
    exerciseId: string,
    file: Express.Multer.File,
  ): Promise<void> {
    const filePath = `${folder}/${exerciseId}`;

    const { error: uploadError } = await this.supabaseService
      .getAdminClient()
      .storage.from('exercise-media')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }
  }

  async getExerciseMedia(folder: MediaFolder, exerciseId: string): Promise<MediaData | null> {
    const filePath = `${folder}/${exerciseId}`;

    const { data, error } = await this.supabaseService
      .getAdminClient()
      .storage.from('exercise-media')
      .download(filePath);

    if (error) {
      return null;
    }

    return {
      data,
      contentType: data.type,
    };
  }

  async deleteExerciseMedia(folder: MediaFolder, exerciseId: string): Promise<void> {
    const filePath = `${folder}/${exerciseId}`;

    const { error } = await this.supabaseService
      .getAdminClient()
      .storage.from('exercise-media')
      .remove([filePath]);

    if (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }
  }
}
