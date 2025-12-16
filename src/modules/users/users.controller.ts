import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { type Response } from 'express';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { SupabaseAuthGuard } from '../../common/guards/supabase-auth.guard';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @ApiOperation({ summary: 'Neuen User registrieren' })
  @ApiResponse({
    status: 201,
    description: 'User wurde erfolgreich registriert',
  })
  @ApiResponse({
    status: 409,
    description: 'E-Mail bereits registriert',
  })
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.usersService.register(registerUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User einloggen' })
  @ApiResponse({
    status: 200,
    description: 'Login erfolgreich',
  })
  @ApiResponse({
    status: 401,
    description: 'Ungültige Anmeldedaten',
  })
  login(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.login(loginUserDto);
  }

  @Patch(':id')
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth('JWT-auth')
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
    status: 403,
    description: 'Keine Berechtigung - User kann nur sich selbst aktualisieren',
  })
  @ApiResponse({
    status: 404,
    description: 'User nicht gefunden',
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @CurrentUser() currentUser: any) {
    if (currentUser.id !== id) {
      throw new ForbiddenException(
        'Sie können nur Ihr eigenes Benutzerkonto aktualisieren',
      );
    }
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth('JWT-auth')
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
    status: 403,
    description: 'Keine Berechtigung - User kann nur sich selbst löschen',
  })
  @ApiResponse({
    status: 404,
    description: 'User nicht gefunden',
  })
  remove(@Param('id') id: string, @CurrentUser() currentUser: any) {
    if (currentUser.id !== id) {
      throw new ForbiddenException(
        'Sie können nur Ihr eigenes Benutzerkonto löschen',
      );
    }
    return this.usersService.remove(id);
  }

  @Post(':id/avatar')
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Avatar-Bild hochladen' })
  @ApiParam({
    name: 'id',
    description: 'User-ID (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Avatar-Bilddatei (JPG, PNG, etc.)',
        },
      },
    },
  })
  @ApiResponse({
    status: 204,
    description: 'Avatar wurde erfolgreich hochgeladen',
  })
  @ApiResponse({
    status: 403,
    description: 'Keine Berechtigung',
  })
  async uploadAvatar(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() currentUser: any,
  ) {
    if (currentUser.id !== id) {
      throw new ForbiddenException(
        'Sie können nur Ihr eigenes Avatar-Bild hochladen',
      );
    }

    await this.usersService.uploadAvatar(id, file);
  }

  @Get(':id/avatar')
  @ApiOperation({ summary: 'Avatar-Bild abrufen' })
  @ApiParam({
    name: 'id',
    description: 'User-ID (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Avatar-Bild wird zurückgegeben',
  })
  @ApiResponse({
    status: 404,
    description: 'Avatar nicht gefunden',
  })
  async getAvatar(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const avatar = await this.usersService.getAvatar(id);

    if (!avatar) {
      throw new NotFoundException('Avatar nicht gefunden');
    }

    res.setHeader('Content-Type', avatar.contentType);
    res.setHeader('Cache-Control', 'public, max-age=3600');
    
    const buffer = Buffer.from(await avatar.data.arrayBuffer());
    res.send(buffer);
  }
}