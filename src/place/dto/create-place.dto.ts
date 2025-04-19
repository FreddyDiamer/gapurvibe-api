import { ApiProperty } from '@nestjs/swagger';

export class CreatePlaceDto {
  @ApiProperty({ example: 'Darvaza' })
  name!: string;

  @ApiProperty({
    example: 'Unique place in Turkmenistan with fire in the crater',
  })
  description?: string;

  @ApiProperty({ example: -52.4322 })
  latitude!: number;

  @ApiProperty({ example: 72.4322 })
  longitude!: number;

  @ApiProperty({ example: 'unique' })
  category?: string;

  @ApiProperty({ example: 550 })
  likes?: number;
}
