import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Place } from './entities/place.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { AddTagDto } from './dto/add-tag.dto';
import { TagsService } from 'src/tags/tags.service';
import { PlaceImagesService } from 'src/place-images/place-images.service';

@Injectable()
export class PlaceService {
  constructor(
    @InjectRepository(Place) private placeRepository: Repository<Place>,
    private readonly usersService: UsersService,
    private readonly tagsService: TagsService,
    private readonly placeImagesService: PlaceImagesService,
  ) {}

  async addImageFilesToPlace(placeId: number, files: Express.Multer.File[]) {
    const place = await this.findOne(placeId);
    if (!place) throw new NotFoundException('Place not found');

    const imagePromises = files.map((file) => {
      const fileName = file.filename;
      const fileUrl = `/uploads/${fileName}`;

      return this.placeImagesService.create({
        url: fileUrl,
        placeId: place.id,
      });
    });

    await Promise.all(imagePromises);
    return this.findOne(placeId);
  }

  async create(createPlaceDto: CreatePlaceDto, files?: Express.Multer.File[]) {
    const user = await this.usersService.findOne(createPlaceDto.userId);
    if (!user) throw new NotFoundException('User not found');

    createPlaceDto = {
      ...createPlaceDto,
      latitude: Number(createPlaceDto.latitude),
      longitude: Number(createPlaceDto.longitude),
    };

    const place = this.placeRepository.create({
      ...createPlaceDto,
      user,
    });
    const savedPlace = await this.placeRepository.save(place);

    if (files && files.length > 0) {
      await this.addImageFilesToPlace(savedPlace.id, files);
    }

    return savedPlace;
  }

  async addTag(addTagDto: AddTagDto) {
    const { placeId, tagId } = addTagDto;

    const tag = await this.tagsService.findOne(tagId);
    if (!tag) throw new NotFoundException('Tag not found');

    const place = await this.findOne(placeId);
    if (!place) throw new NotFoundException('Place not found');

    const isExistsTag = place.tags.some((tag) => tag.id === tagId);
    if (!isExistsTag) place.tags.push(tag);
    else place.tags = [];

    return await this.placeRepository.save(place);
  }

  async findAll() {
    const places = await this.placeRepository.find({
      relations: { user: true, tags: true, images: true },
    });
    return places;
  }

  async findOne(id: number) {
    return await this.placeRepository.findOne({
      where: { id },
      relations: { user: true, tags: true, images: true },
    });
  }

  async update(id: number, updatePlaceDto: UpdatePlaceDto) {
    const place = await this.findOne(id);
    if (!place) {
      throw new NotFoundException();
    }

    Object.assign(place, updatePlaceDto);

    return await this.placeRepository.save(place);
  }

  async remove(id: number) {
    const place = await this.findOne(id);
    if (!place) {
      throw new NotFoundException();
    }

    return await this.placeRepository.remove(place);
  }
}
