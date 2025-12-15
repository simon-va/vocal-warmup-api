import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Benutzername des Users',
    example: 'maxmustermann',
    required: false,
  })
  @IsString()
  @IsOptional()
  username?: string;
}