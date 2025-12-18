import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class UpdateSubcategoryDto {
  @ApiProperty({
    description: 'ID der übergeordneten Kategorie',
    example: 1,
    required: false,
  })
  @IsInt()
  @IsOptional()
  categoryId?: number;

  @ApiProperty({
    description: 'Eindeutiger Name der Unterkategorie',
    example: 'diaphragmatic',
    maxLength: 50,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  name?: string;

  @ApiProperty({
    description: 'Anzeigename der Unterkategorie',
    example: 'Zwerchfellatmung',
    maxLength: 100,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  displayName?: string;

  @ApiProperty({
    description: 'Sortierreihenfolge der Unterkategorie',
    example: 1,
    minimum: 0,
    required: false,
  })
  @IsInt()
  @IsOptional()
  @Min(0)
  sortOrder?: number;
}
