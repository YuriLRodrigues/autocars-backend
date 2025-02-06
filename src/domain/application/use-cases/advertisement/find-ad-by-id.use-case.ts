import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { Either, left, right } from '@root/core/logic/Either';
import { AdvertisementDetails } from '@root/domain/enterprise/value-object/advertisement-details';

import { AdvertisementRepository } from '../../repositories/advertisement.repository';

type Output = Either<ResourceNotFoundError, AdvertisementDetails>;

type Input = {
  id: UniqueEntityId;
};

@Injectable()
export class FindAdByIdUseCase {
  constructor(private readonly advertisementRepository: AdvertisementRepository) {}

  async execute({ id }: Input): Promise<Output> {
    const { value: advertisement, isNone: advertisementNotFound } =
      await this.advertisementRepository.findAdDetailsById({
        id,
      });

    if (advertisementNotFound()) {
      return left(new ResourceNotFoundError());
    }

    return right(advertisement);
  }
}
