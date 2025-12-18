import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class UpdateCategoryDto {
  @ApiProperty({
    description: 'Eindeutiger Name der Kategorie',
    example: 'breathing',
    maxLength: 50,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  name?: string;

  @ApiProperty({
    description: 'Anzeigename der Kategorie',
    example: 'Atmung',
    maxLength: 100,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  displayName?: string;

  @ApiProperty({
    description: 'Sortierreihenfolge der Kategorie',
    example: 1,
    minimum: 0,
    required: false,
  })
  @IsInt()
  @IsOptional()
  @Min(0)
  sortOrder?: number;

  @ApiProperty({
    description: 'Gewichtung der Kategorie',
    example: 10,
    minimum: 0,
    required: false,
  })
  @IsInt()
  @IsOptional()
  @Min(0)
  weight?: number;
}
