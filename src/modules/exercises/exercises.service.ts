import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { Exercise } from './entities/exercise.entity';

@Injectable()
export class ExercisesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  async create(createExerciseDto: CreateExerciseDto): Promise<Exercise> {
    try {
      const exercise = await this.prisma.exercise.create({
        data: createExerciseDto,
      });
      return exercise;
    } catch (error) {
      if (error.code === 'P2003') {
        throw new NotFoundException(
          'Category or Subcategory not found',
        );
      }
      throw error;
    }
  }

  async findAll(): Promise<Exercise[]> {
    return this.prisma.exercise.findMany({
      orderBy: { id: 'asc' },
    });
  }

  async update(
    id: number,
    updateExerciseDto: UpdateExerciseDto,
  ): Promise<Exercise> {
    try {
      const exercise = await this.prisma.exercise.update({
        where: { id },
        data: updateExerciseDto,
      });
      return exercise;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Exercise with ID ${id} not found`);
      }
      if (error.code === 'P2003') {
        throw new NotFoundException(
          'Category or Subcategory not found',
        );
      }
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    const exerciseId = id.toString();

    // Attempt to remove any media associated with this exercise. Failures
    // deleting non-existent media should not block the DB deletion.
    try {
      await this.storageService.deleteExerciseMedia('videos', exerciseId);
    } catch (err) {
      console.log(`No video to delete for exercise ${exerciseId}`);
    }

    try {
      await this.storageService.deleteExerciseMedia('audios', exerciseId);
    } catch (err) {
      console.log(`No audio to delete for exercise ${exerciseId}`);
    }

    try {
      await this.storageService.deleteExerciseMedia('images', exerciseId);
    } catch (err) {
      console.log(`No image to delete for exercise ${exerciseId}`);
    }

    try {
      await this.prisma.exercise.delete({ where: { id } });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Exercise with ID ${id} not found`);
      }
      throw error;
    }
  }

  async updateMediaFlags(id: number, flags: { hasVideo?: boolean; hasAudio?: boolean; hasImage?: boolean; }): Promise<Exercise> {
    try {
      const exercise = await this.prisma.exercise.update({
        where: { id },
        data: flags,
      });
      return exercise;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Exercise with ID ${id} not found`);
      }
      throw error;
    }
  }
}
