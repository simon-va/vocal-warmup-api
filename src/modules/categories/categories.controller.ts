import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
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
