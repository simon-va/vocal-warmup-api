import { ApiProperty } from '@nestjs/swagger';

export class Exercise {
  @ApiProperty({
    description: 'Eindeutige Übungs-ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Name der Übung',
    example: 'Atemübung für Anfänger',
  })
  name: string;

  @ApiProperty({
    description: 'ID der Kategorie',
    example: 1,
  })
  categoryId: number;

  @ApiProperty({
    description: 'ID der Unterkategorie',
    example: 1,
    nullable: true,
  })
  subcategoryId: number | null;

  @ApiProperty({
    description: 'Schwierigkeitsgrad der Übung (1 = Anfänger, 2 = Fortgeschritten)',
    example: 1,
    nullable: true,
  })
  level: number | null;

  @ApiProperty({
    description: 'Dauer der Übung in Sekunden',
    example: 300,
  })
  duration: number;

  @ApiProperty({
    description: 'Anleitung für die Übung',
    example: 'Atmen Sie tief ein und langsam aus...',
    nullable: true,
  })
  instruction: string | null;

  @ApiProperty({
    description: 'Hat die Übung ein Video',
    example: false,
  })
  hasVideo: boolean;

  @ApiProperty({
    description: 'Hat die Übung eine Audiodatei',
    example: false,
  })
  hasAudio: boolean;

  @ApiProperty({
    description: 'Hat die Übung ein Bild',
    example: false,
  })
  hasImage: boolean;

  @ApiProperty({
    description: 'Zeitpunkt der Erstellung',
    example: '2025-12-17T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Zeitpunkt der letzten Aktualisierung',
    example: '2025-12-17T10:30:00.000Z',
  })
  updatedAt: Date;
}
