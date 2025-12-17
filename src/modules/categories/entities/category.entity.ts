import { ApiProperty } from '@nestjs/swagger';

export class Category {
  @ApiProperty({
    description: 'Eindeutige Kategorie-ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Eindeutiger Name der Kategorie',
    example: 'breathing',
  })
  name: string;

  @ApiProperty({
    description: 'Anzeigename der Kategorie',
    example: 'Atmung',
  })
  displayName: string;

  @ApiProperty({
    description: 'Sortierreihenfolge der Kategorie',
    example: 1,
  })
  sortOrder: number;

  @ApiProperty({
    description: 'Gewichtung der Kategorie',
    example: 10,
  })
  weight: number;

  @ApiProperty({
    description: 'Zeitpunkt der Erstellung',
    example: '2025-12-17T10:30:00.000Z',
  })
  createdAt: Date;
}
