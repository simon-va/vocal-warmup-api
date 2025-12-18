import { ApiProperty } from '@nestjs/swagger';
import {
    IsEnum,
    IsInt,
    IsOptional,
    IsString,
    MaxLength,
    Min,
} from 'class-validator';
import { ExerciseLevel } from '../enums/exercise-level.enum';

export class UpdateExerciseDto {
  @ApiProperty({
    description: 'Name der Übung',
    example: 'Atemübung für Anfänger',
    maxLength: 200,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  name?: string;

  @ApiProperty({
    description: 'ID der Kategorie',
    example: 1,
    required: false,
  })
  @IsInt()
  @IsOptional()
  categoryId?: number;

  @ApiProperty({
    description: 'ID der Unterkategorie',
    example: 1,
    required: false,
  })
  @IsInt()
  @IsOptional()
  subcategoryId?: number;

  @ApiProperty({
    description: 'Schwierigkeitsgrad der Übung',
    example: ExerciseLevel.Anfänger,
    required: false,
    nullable: true,
    enum: ExerciseLevel,
    enumName: 'ExerciseLevel',
  })
  @IsEnum(ExerciseLevel)
  @IsOptional()
  level?: ExerciseLevel;

  @ApiProperty({
    description: 'Dauer der Übung in Sekunden',
    example: 300,
    minimum: 0,
    required: false,
  })
  @IsInt()
  @IsOptional()
  @Min(0)
  duration?: number;

  @ApiProperty({
    description: 'Anleitung für die Übung',
    example: 'Atmen Sie tief ein und langsam aus...',
    required: false,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  instruction?: string;
}
