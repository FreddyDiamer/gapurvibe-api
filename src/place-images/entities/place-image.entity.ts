import { ApiProperty } from '@nestjs/swagger';
import { Place } from 'src/place/entities/place.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class PlaceImage {
  @ApiProperty({ example: 1, description: 'Unique ID of the image' })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({
    example: 'http://example.com/image.jpg',
    description: 'URL of the image',
  })
  @Column()
  url!: string;

  @ApiProperty({ description: 'Place associated with the image' })
  @ManyToOne(() => Place, (place) => place.images)
  place!: Place;

  @ApiProperty({
    example: new Date().toISOString(),
    description: 'Date when the image was uploaded',
  })
  @CreateDateColumn()
  createdAt!: Date;
}
