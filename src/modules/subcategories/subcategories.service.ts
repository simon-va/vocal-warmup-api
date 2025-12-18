import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { Subcategory } from './entities/subcategory.entity';

@Injectable()
export class SubcategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createSubcategoryDto: CreateSubcategoryDto,
  ): Promise<Subcategory> {
    try {
      const subcategory = await this.prisma.subcategory.create({
        data: createSubcategoryDto,
      });
      return subcategory;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          'Subcategory with this name already exists in this category',
        );
      }
      if (error.code === 'P2003') {
        throw new NotFoundException(
          `Category with ID ${createSubcategoryDto.categoryId} not found`,
        );
      }
      throw error;
    }
  }

  async findAll(): Promise<Subcategory[]> {
    return this.prisma.subcategory.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  }

  async update(
    id: number,
    updateSubcategoryDto: UpdateSubcategoryDto,
  ): Promise<Subcategory> {
    try {
      const subcategory = await this.prisma.subcategory.update({
        where: { id },
        data: updateSubcategoryDto,
      });
      return subcategory;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Subcategory with ID ${id} not found`);
      }
      if (error.code === 'P2002') {
        throw new ConflictException(
          'Subcategory with this name already exists in this category',
        );
      }
      if (error.code === 'P2003') {
        throw new NotFoundException(
          `Category with ID ${updateSubcategoryDto.categoryId} not found`,
        );
      }
      throw error;
    }
  }
}
