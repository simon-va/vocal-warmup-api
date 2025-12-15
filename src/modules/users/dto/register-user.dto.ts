import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({
    description: 'E-Mail-Adresse des Users',
    example: 'max@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Passwort (mindestens 6 Zeichen)',
    example: 'sicheresPasswort123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Benutzername des Users',
    example: 'maxmustermann',
    required: false,
  })
  @IsString()
  @IsOptional()
  username?: string;
}