import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { AppService } from './app.service';
import { CurrentUser } from './common/decorators/current-user.decorator';
import { SupabaseAuthGuard } from './common/guards/supabase-auth.guard';
import { HealthResponseDto } from './dto/health-response.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Hello World Endpunkt' })
  @ApiResponse({ 
    status: 200, 
    description: 'Gibt eine Begrüßungsnachricht zurück',
    schema: {
      type: 'string',
      example: 'Hello World!'
    }
  })
  @UseGuards(SupabaseAuthGuard)
  getHello(@CurrentUser() user: any): string {
    console.log(user);

    return this.appService.getHello();
  }

  @Get('health')
  @ApiOperation({ summary: 'Health Check' })
  @ApiResponse({ 
    status: 200, 
    description: 'Gibt den Status der Anwendung zurück',
    type: HealthResponseDto
  })
  @SkipThrottle()
  getHealth(): HealthResponseDto {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
