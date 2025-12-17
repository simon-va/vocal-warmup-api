import { ApiProperty } from '@nestjs/swagger';

export class Subcategory {
  @ApiProperty({
    description: 'Eindeutige Unterkategorie-ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'ID der übergeordneten Kategorie',
    example: 1,
  })
  categoryId: number;

  @ApiProperty({
    description: 'Eindeutiger Name der Unterkategorie',
    example: 'diaphragmatic',
  })
  name: string;

  @ApiProperty({
    description: 'Anzeigename der Unterkategorie',
    example: 'Zwerchfellatmung',
  })
  displayName: string;

  @ApiProperty({
    description: 'Sortierreihenfolge der Unterkategorie',
    example: 1,
  })
  sortOrder: number;

  @ApiProperty({
    description: 'Zeitpunkt der Erstellung',
    example: '2025-12-17T10:30:00.000Z',
  })
  createdAt: Date;
}
