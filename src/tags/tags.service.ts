import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagsService {
  constructor(@InjectRepository(Tag) private tagsRepository: Repository<Tag>) {}

  async create(createTagDto: CreateTagDto) {
    try {
      const tag = this.tagsRepository.create(createTagDto);

      return await this.tagsRepository.save(tag);
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }

  async findAll() {
    return await this.tagsRepository.find();
  }

  async findOne(id: number) {
    return await this.tagsRepository.findOne({
      where: { id },
      relations: { places: true },
    });
  }

  async findByName(name: string) {
    return await this.tagsRepository.findOne({ where: { name } });
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    const tag = await this.findOne(id);
    if (!tag) {
      throw new NotFoundException();
    }

    Object.assign(tag, updateTagDto);

    return await this.tagsRepository.save(tag);
  }

  async remove(id: number) {
    try {
      const tag = await this.findOne(id);
      if (!tag) {
        throw new NotFoundException();
      }

      return await this.tagsRepository.remove(tag);
    } catch (error) {
      console.log('HERE IS ERROR', error);
      throw error;
    }
  }
}
