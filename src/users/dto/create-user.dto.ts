import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'freddy@gmail.com',
    description: 'User Email',
  })
  @IsEmail({}, { message: 'Enter a valid email' })
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    example: 'Password123',
    description: 'Password (minimum 6 characters)',
  })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password!: string;

  @ApiProperty({
    example: 'freddy',
    description: 'User name (optional)',
    required: false,
  })
  @IsString()
  @MinLength(2, {
    message: 'User name must be at least 2 characters long',
  })
  @MaxLength(30, {
    message: 'User name must not exceed 30 characters',
  })
  @IsOptional()
  username?: string;
}
