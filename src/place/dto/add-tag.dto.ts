import { ApiProperty } from '@nestjs/swagger';

export class AddTagDto {
  @ApiProperty({ example: 1 })
  placeId: number;

  @ApiProperty({ example: 1 })
  tagId: number;
}
