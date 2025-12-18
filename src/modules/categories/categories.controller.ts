import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse, ApiOperation, ApiParam, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AdminGuard } from '../../common/guards/admin.guard';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@ApiTags('categories')
@ApiBearerAuth('JWT-auth')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(SupabaseAuthGuard, AdminGuard)
  @ApiForbiddenResponse({ description: 'Admin rights required' })
  @ApiOperation({ summary: 'Neue Kategorie erstellen' })
  @ApiResponse({
    status: 201,
    description: 'Kategorie wurde erfolgreich erstellt',
    type: Category,
  })
  @ApiResponse({
    status: 409,
    description: 'Kategorie mit diesem Namen existiert bereits',
  })
  create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @UseGuards(SupabaseAuthGuard)
  @ApiOperation({ summary: 'Alle Kategorien abrufen' })
  @ApiResponse({
    status: 200,
    description: 'Liste aller Kategorien',
    type: [Category],
  })
  findAll(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  @Patch(':id')
  @UseGuards(SupabaseAuthGuard, AdminGuard)
  @ApiForbiddenResponse({ description: 'Admin rights required' })
  @ApiOperation({ summary: 'Kategorie aktualisieren' })
  @ApiParam({
    name: 'id',
    description: 'Kategorie-ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Kategorie wurde erfolgreich aktualisiert',
    type: Category,
  })
  @ApiResponse({
    status: 404,
    description: 'Kategorie nicht gefunden',
  })
  @ApiResponse({
    status: 409,
    description: 'Kategorie mit diesem Namen existiert bereits',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoriesService.update(id, updateCategoryDto);
  }
}
