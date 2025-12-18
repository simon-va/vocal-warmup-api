import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { type Response } from 'express';
import { AdminGuard } from '../../common/guards/admin.guard';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { StorageService, type MediaFolder } from '../storage/storage.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { Exercise } from './entities/exercise.entity';
import { ExercisesService } from './exercises.service';

@ApiTags('exercises')
@ApiBearerAuth('JWT-auth')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller('exercises')
export class ExercisesController {
  constructor(
    private readonly exercisesService: ExercisesService,
    private readonly storageService: StorageService,
  ) {}

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

  @Post(':id/media')
  @UseGuards(SupabaseAuthGuard, AdminGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'video', maxCount: 1 },
      { name: 'audio', maxCount: 1 },
      { name: 'image', maxCount: 1 },
    ]),
  )
  @ApiOperation({ summary: 'Upload media (video/audio/image) for an exercise' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        video: {
          type: 'string',
          format: 'binary',
          description: 'Video file (mp4, webm, etc.)',
        },
        audio: {
          type: 'string',
          format: 'binary',
          description: 'Audio file (mp3, wav, etc.)',
        },
        image: {
          type: 'string',
          format: 'binary',
          description: 'Image file (jpg, png, etc.)',
        },
      },
    },
  })
  @HttpCode(HttpStatus.OK)
  async uploadMedia(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFiles()
    files: {
      video?: Express.Multer.File[];
      audio?: Express.Multer.File[];
      image?: Express.Multer.File[];
    },
  ): Promise<Exercise> {
    console.log('new file upload' ,id)
    const exerciseId = id.toString();

    const flags: { hasVideo?: boolean; hasAudio?: boolean; hasImage?: boolean } = {};

    if (files.video && files.video[0]) {
      await this.storageService.uploadExerciseMedia('videos', exerciseId, files.video[0]);
      flags.hasVideo = true;
    }

    if (files.audio && files.audio[0]) {
      await this.storageService.uploadExerciseMedia('audios', exerciseId, files.audio[0]);
      flags.hasAudio = true;
    }

    if (files.image && files.image[0]) {
      await this.storageService.uploadExerciseMedia('images', exerciseId, files.image[0]);
      flags.hasImage = true;
    }

    if (Object.keys(flags).length > 0) {
      return this.exercisesService.updateMediaFlags(id, flags);
    }

    return this.exercisesService.update(id, {} as any);
  }

  @Get(':id/media/:folder')
  @UseGuards(SupabaseAuthGuard)
  @ApiOperation({ summary: 'Get media file for an exercise' })
  async getMedia(
    @Param('id', ParseIntPipe) id: number,
    @Param('folder') folder: MediaFolder,
    @Res() res: Response,
  ) {
    const media = await this.storageService.getExerciseMedia(folder, id.toString());

    if (!media) {
      throw new NotFoundException('Media not found');
    }

    res.setHeader('Content-Type', media.contentType);
    res.setHeader('Cache-Control', 'public, max-age=3600');

    const buffer = Buffer.from(await media.data.arrayBuffer());
    res.send(buffer);
  }
}
