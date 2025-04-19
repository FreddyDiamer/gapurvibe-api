import { PartialType } from '@nestjs/swagger';
import { CreatePlaceImageDto } from './create-place-image.dto';

export class UpdatePlaceImageDto extends PartialType(CreatePlaceImageDto) {}
