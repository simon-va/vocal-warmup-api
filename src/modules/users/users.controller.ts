import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Neuen User erstellen' })
  @ApiResponse({
    status: 201,
    description: 'User wurde erfolgreich erstellt',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'Ungültige Eingabedaten',
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Alle User abrufen' })
  @ApiResponse({
    status: 200,
    description: 'Liste aller User',
    type: [User],
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Einen User anhand der ID abrufen' })
  @ApiParam({
    name: 'id',
    description: 'User-ID (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'User gefunden',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'User nicht gefunden',
  })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'User aktualisieren' })
  @ApiParam({
    name: 'id',
    description: 'User-ID (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'User wurde erfolgreich aktualisiert',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: 'User nicht gefunden',
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'User löschen' })
  @ApiParam({
    name: 'id',
    description: 'User-ID (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 204,
    description: 'User wurde erfolgreich gelöscht',
  })
  @ApiResponse({
    status: 404,
    description: 'User nicht gefunden',
  })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}