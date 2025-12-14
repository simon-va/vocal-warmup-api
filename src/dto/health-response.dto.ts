import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO für Health Check Response
 * DTOs (Data Transfer Objects) sind Best Practice für:
 * - Type Safety
 * - Automatische OpenAPI Dokumentation
 * - Validation
 */
export class HealthResponseDto {
  @ApiProperty({ 
    description: 'Status der Anwendung',
    example: 'ok',
    enum: ['ok', 'error']
  })
  status: string;

  @ApiProperty({ 
    description: 'Zeitstempel der Abfrage',
    example: '2024-01-01T12:00:00.000Z'
  })
  timestamp: string;
}