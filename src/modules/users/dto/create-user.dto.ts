import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'E-Mail-Adresse des Users',
    example: 'max@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Name des Users',
    example: 'Max Mustermann',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;
}