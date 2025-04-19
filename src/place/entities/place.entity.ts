import { ApiProperty } from '@nestjs/swagger';
import { PlaceImage } from 'src/place-images/entities/place-image.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Place {
  @ApiProperty({ example: 1, description: 'Unique ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 2, description: 'User who created place' })
  @ManyToOne(() => User, (user) => user.places)
  user: User;

  @ApiProperty({ example: [1] })
  @ManyToMany(() => Tag, (tag) => tag.places)
  @JoinTable()
  tags: Tag[];

  @ApiProperty({ example: 'Darvaza' })
  @Column()
  name: string;

  @ApiProperty({
    example: 'Unique place in Turkmenistan with the fine in the crater',
  })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({ example: -52.4322 })
  @Column({ type: 'float' })
  latitude: number;

  @ApiProperty({ example: 72.4322 })
  @Column({ type: 'float' })
  longitude: number;

  @ApiProperty({ example: 'unique' })
  @Column({ nullable: true })
  category: string;

  @ApiProperty({ description: 'Images associated with the place' })
  @OneToMany(() => PlaceImage, (placeImage) => placeImage.place)
  images: PlaceImage[];

  @ApiProperty({ example: 550 })
  @Column({ default: 0 })
  likes: number;

  @ApiProperty({ example: new Date().toISOString() })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ example: new Date().toISOString() })
  @UpdateDateColumn()
  updatedAt: Date;
}
