import {
  Body,
  Controller,
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
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { Subcategory } from './entities/subcategory.entity';
import { SubcategoriesService } from './subcategories.service';

@ApiTags('subcategories')
@ApiBearerAuth('JWT-auth')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@Controller('subcategories')
export class SubcategoriesController {
  constructor(private readonly subcategoriesService: SubcategoriesService) {}

  @Post()
  @UseGuards(SupabaseAuthGuard, AdminGuard)
  @ApiForbiddenResponse({ description: 'Admin rights required' })
  @ApiOperation({ summary: 'Neue Unterkategorie erstellen' })
  @ApiResponse({
    status: 201,
    description: 'Unterkategorie wurde erfolgreich erstellt',
    type: Subcategory,
  })
  @ApiResponse({
    status: 404,
    description: 'Kategorie nicht gefunden',
  })
  @ApiResponse({
    status: 409,
    description:
      'Unterkategorie mit diesem Namen existiert bereits in dieser Kategorie',
  })
  create(
    @Body() createSubcategoryDto: CreateSubcategoryDto,
  ): Promise<Subcategory> {
    return this.subcategoriesService.create(createSubcategoryDto);
  }

  @Get()
  @UseGuards(SupabaseAuthGuard)
  @ApiOperation({ summary: 'Alle Unterkategorien abrufen' })
  @ApiResponse({
    status: 200,
    description: 'Liste aller Unterkategorien',
    type: [Subcategory],
  })
  findAll(): Promise<Subcategory[]> {
    return this.subcategoriesService.findAll();
  }

  @Patch(':id')
  @UseGuards(SupabaseAuthGuard, AdminGuard)
  @ApiForbiddenResponse({ description: 'Admin rights required' })
  @ApiOperation({ summary: 'Unterkategorie aktualisieren' })
  @ApiParam({
    name: 'id',
    description: 'Unterkategorie-ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Unterkategorie wurde erfolgreich aktualisiert',
    type: Subcategory,
  })
  @ApiResponse({
    status: 404,
    description: 'Unterkategorie oder Kategorie nicht gefunden',
  })
  @ApiResponse({
    status: 409,
    description:
      'Unterkategorie mit diesem Namen existiert bereits in dieser Kategorie',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSubcategoryDto: UpdateSubcategoryDto,
  ): Promise<Subcategory> {
    return this.subcategoriesService.update(id, updateSubcategoryDto);
  }
}
