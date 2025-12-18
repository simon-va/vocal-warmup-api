import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { Exercise } from './entities/exercise.entity';

@Injectable()
export class ExercisesService {
  constructor(private readonly prisma: PrismaService) {}

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
    try {
      await this.prisma.exercise.delete({
        where: { id },
      });
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
