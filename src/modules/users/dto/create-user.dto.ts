import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'User-ID (UUID aus Supabase Auth)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Benutzername des Users',
    example: 'maxmustermann',
    required: false,
  })
  @IsString()
  @IsOptional()
  username?: string;
}