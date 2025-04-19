import { ApiProperty } from '@nestjs/swagger';
import { Place } from 'src/place/entities/place.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({ example: 'Freddy' })
  @Column({ unique: true })
  username!: string;

  @ApiProperty({ example: 'freddy@gmail.com' })
  @Column({ unique: true })
  email!: string;

  @ApiProperty({ example: '123456' })
  @Column()
  password!: string;

  @OneToMany(() => Place, (place) => place.user)
  places!: Place[];

  @ApiProperty({ example: new Date().toISOString() })
  @CreateDateColumn()
  createdAt!: string;
}
