import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty({
    description: 'Eindeutige User-ID (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'E-Mail-Adresse des Users',
    example: 'max@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Name des Users',
    example: 'Max Mustermann',
    nullable: true,
  })
  name: string | null;

  @ApiProperty({
    description: 'Zeitpunkt der Erstellung',
    example: '2025-12-14T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Zeitpunkt der letzten Aktualisierung',
    example: '2025-12-14T10:30:00.000Z',
  })
  updatedAt: Date;
}