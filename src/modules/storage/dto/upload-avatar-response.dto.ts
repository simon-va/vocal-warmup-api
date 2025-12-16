import { ApiProperty } from '@nestjs/swagger';

export class UploadAvatarResponseDto {
  @ApiProperty({
    description: 'Öffentliche URL des hochgeladenen Avatar-Bildes',
    example:
      'https://your-project.supabase.co/storage/v1/object/public/avatars/user-123-1234567890.jpg',
  })
  avatarUrl: string;
}
