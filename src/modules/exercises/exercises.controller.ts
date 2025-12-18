import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AdminGuard } from '../../common/guards/admin.guard';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { Exercise } from './entities/exercise.entity';
import { ExercisesService } from './exercises.service';

@ApiTags('exercises')
@ApiBearerAuth('JWT-auth')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Post()
  @UseGuards(SupabaseAuthGuard, AdminGuard)
  @ApiForbiddenResponse({ description: 'Admin rights required' })
  @ApiOperation({ summary: 'Neue Übung erstellen' })
  @ApiResponse({
    status: 201,
    description: 'Übung wurde erfolgreich erstellt',
    type: Exercise,
  })
  @ApiResponse({
    status: 404,
    description: 'Kategorie oder Unterkategorie nicht gefunden',
  })
  create(@Body() createExerciseDto: CreateExerciseDto): Promise<Exercise> {
    return this.exercisesService.create(createExerciseDto);
  }

  @Get()
  @UseGuards(SupabaseAuthGuard)
  @ApiOperation({ summary: 'Alle Übungen abrufen' })
  @ApiResponse({
    status: 200,
    description: 'Liste aller Übungen',
    type: [Exercise],
  })
  findAll(): Promise<Exercise[]> {
    return this.exercisesService.findAll();
  }

  @Patch(':id')
  @UseGuards(SupabaseAuthGuard, AdminGuard)
  @ApiForbiddenResponse({ description: 'Admin rights required' })
  @ApiOperation({ summary: 'Übung aktualisieren' })
  @ApiParam({
    name: 'id',
    description: 'Übungs-ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Übung wurde erfolgreich aktualisiert',
    type: Exercise,
  })
  @ApiResponse({
    status: 404,
    description: 'Übung, Kategorie oder Unterkategorie nicht gefunden',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExerciseDto: UpdateExerciseDto,
  ): Promise<Exercise> {
    return this.exercisesService.update(id, updateExerciseDto);
  }

  @Delete(':id')
  @UseGuards(SupabaseAuthGuard, AdminGuard)
  @ApiForbiddenResponse({ description: 'Admin rights required' })
  @ApiOperation({ summary: 'Übung löschen' })
  @ApiParam({
    name: 'id',
    description: 'Übungs-ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Übung wurde erfolgreich gelöscht',
  })
  @ApiResponse({
    status: 404,
    description: 'Übung nicht gefunden',
  })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.exercisesService.remove(id);
  }
}
