import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PlaceImagesService } from './place-images.service';
import { CreatePlaceImageDto } from './dto/create-place-image.dto';
import { UpdatePlaceImageDto } from './dto/update-place-image.dto';

@Controller('place-images')
export class PlaceImagesController {
  constructor(private readonly placeImagesService: PlaceImagesService) {}

  @Post()
  create(@Body() createPlaceImageDto: CreatePlaceImageDto) {
    return this.placeImagesService.create(createPlaceImageDto);
  }

  @Get()
  findAll() {
    return this.placeImagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.placeImagesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlaceImageDto: UpdatePlaceImageDto) {
    return this.placeImagesService.update(+id, updatePlaceImageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.placeImagesService.remove(+id);
  }
}
