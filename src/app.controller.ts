import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { HealthResponseDto } from './dto/health-response.dto';

@ApiTags('app')
@Controller()
export class AppController {
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
