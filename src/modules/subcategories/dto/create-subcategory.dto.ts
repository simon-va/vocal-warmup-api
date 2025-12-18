import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';

export class CreateSubcategoryDto {
  @ApiProperty({
    description: 'ID der übergeordneten Kategorie',
    example: 1,
  })
  @IsInt()
  @IsNotEmpty()
  categoryId: number;

  @ApiProperty({
    description: 'Eindeutiger Name der Unterkategorie',
    example: 'diaphragmatic',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @ApiProperty({
    description: 'Anzeigename der Unterkategorie',
    example: 'Zwerchfellatmung',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  displayName: string;

  @ApiProperty({
    description: 'Sortierreihenfolge der Unterkategorie',
    example: 1,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  sortOrder: number;
}
