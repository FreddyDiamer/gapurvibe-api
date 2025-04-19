import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlaceImageDto } from './dto/create-place-image.dto';
import { UpdatePlaceImageDto } from './dto/update-place-image.dto';
import { Repository } from 'typeorm';
import { PlaceImage } from './entities/place-image.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PlaceImagesService {
  constructor(
    @InjectRepository(PlaceImage)
    private placeImageRepository: Repository<PlaceImage>,
  ) {}

  async create(createPlaceImageDto: CreatePlaceImageDto) {
    const placeImage = this.placeImageRepository.create(createPlaceImageDto);
    return await this.placeImageRepository.save(placeImage);
  }

  async findAll() {
    return await this.placeImageRepository.find();
  }

  async findOne(id: number) {
    const placeImage = await this.placeImageRepository.findOne({
      where: { id },
    });
    if (!placeImage) throw new NotFoundException('Place image not found');

    return placeImage;
  }

  async update(id: number, updatePlaceImageDto: UpdatePlaceImageDto) {
    const placeImage = await this.findOne(id);
    if (!placeImage) throw new NotFoundException('Place image not found');

    Object.assign(placeImage, updatePlaceImageDto);

    return await this.placeImageRepository.save(placeImage);
  }

  async remove(id: number) {
    const placeImage = await this.findOne(id);
    if (!placeImage) throw new NotFoundException('Place image not found');

    return await this.placeImageRepository.remove(placeImage);
  }
}
