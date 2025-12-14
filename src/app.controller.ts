import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
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
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiOperation({ summary: 'Health Check' })
  @ApiResponse({ 
    status: 200, 
    description: 'Gibt den Status der Anwendung zurück',
    type: HealthResponseDto
  })
  getHealth(): HealthResponseDto {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
