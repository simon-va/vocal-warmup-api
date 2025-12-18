import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Eindeutiger Name der Kategorie',
    example: 'breathing',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @ApiProperty({
    description: 'Anzeigename der Kategorie',
    example: 'Atmung',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  displayName: string;

  @ApiProperty({
    description: 'Sortierreihenfolge der Kategorie',
    example: 1,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  sortOrder: number;

  @ApiProperty({
    description: 'Gewichtung der Kategorie',
    example: 10,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  weight: number;
}
