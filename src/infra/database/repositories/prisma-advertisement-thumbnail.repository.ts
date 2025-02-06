import { Injectable } from '@nestjs/common';
import {
  AdvertisementThumbnailRepository,
  UpdateProps,
} from '@root/domain/application/repositories/advertisement-thumbnail.repository';

import { AdvertisementThumbnailMappers } from '../mappers/advertisement-thumbnail.mappers';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaAdvertisementThumbnailRepository implements AdvertisementThumbnailRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async update({ advertisementThumbnail }: UpdateProps): Promise<void> {
    const raw = AdvertisementThumbnailMappers.toPersistence(advertisementThumbnail);

    await this.prismaService.image.update(raw);

    return;
  }
}
