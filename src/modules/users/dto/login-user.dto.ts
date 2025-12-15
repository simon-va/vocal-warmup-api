import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    description: 'E-Mail-Adresse des Users',
    example: 'max@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Passwort',
    example: 'sicheresPasswort123',
  })
  @IsString()
  password: string;
}