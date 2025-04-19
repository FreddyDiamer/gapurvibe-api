import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './entities/favorite.entity';
import { UsersService } from 'src/users/users.service';
import { PlaceService } from 'src/place/place.service';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,
    private usersService: UsersService,
    private placeService: PlaceService,
  ) {}

  async create(createFavoriteDto: CreateFavoriteDto) {
    const user = await this.usersService.findOne(1);
    if (!user) throw new NotFoundException('User not found');

    const place = await this.placeService.findOne(createFavoriteDto.placeId);
    if (!place) throw new NotFoundException('Place not found');

    const favorite = this.favoriteRepository.create({ place, user });
    return await this.favoriteRepository.save(favorite);
  }

  async findAll() {
    return await this.favoriteRepository.find();
  }

  async findOne(id: number) {
    const favorite = await this.favoriteRepository.findOne({
      where: { id },
      relations: { user: true, place: true },
    });
    if (!favorite) throw new NotFoundException('Favorite not found');

    const response = { ...favorite, count: 5 };
    return response;
  }

  async update(id: number, updateFavoriteDto: UpdateFavoriteDto) {
    const favorite = await this.findOne(id);
    if (!favorite) throw new NotFoundException('Favorite not found');

    Object.assign(favorite, updateFavoriteDto);
    return await this.favoriteRepository.save(favorite);
  }

  async remove(id: number) {
    const favorite = await this.findOne(id);
    if (!favorite) throw new NotFoundException('Favorite not found');

    return await this.favoriteRepository.remove(favorite);
  }
}
