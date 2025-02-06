import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { Either, left, right } from '@root/core/logic/Either';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';

import { ImageRepository } from '../../repositories/image.repository';
import { UserRepository } from '../../repositories/user.repository';

type Input = {
  userId: UniqueEntityId;
};

type Output = Either<
  NotAllowedError,
  {
    totalCount: number;
    totalInAdvertisements: number;
    totalThumbnails: number;
    totalUnused: number;
  }
>;

@Injectable()
export class FindImagesMetricsUseCase {
  constructor(
    private readonly imageRepository: ImageRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute({ userId }: Input): Promise<Output> {
    const { isNone: userNotExists, value: user } = await this.userRepository.findById({
      id: userId,
    });

    if (userNotExists() || !user.roles.includes(UserRoles.Manager)) {
      return left(new NotAllowedError());
    }

    const { value: imagesMetrics } = await this.imageRepository.findMetrics();

    return right(imagesMetrics);
  }
}
