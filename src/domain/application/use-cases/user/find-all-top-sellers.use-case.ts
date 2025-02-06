import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { Either, left, right } from '@root/core/logic/Either';
import { TopSellerDetails } from '@root/domain/enterprise/value-object/top-seller-details';

import { UserRepository } from '../../repositories/user.repository';

type Output = Either<NotAllowedError, TopSellerDetails[]>;

type Input = {
  userId: UniqueEntityId;
};

@Injectable()
export class FindAllTopSellersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ userId }: Input): Promise<Output> {
    const { isNone: userNotFound } = await this.userRepository.findById({ id: userId });

    if (userNotFound()) return left(new NotAllowedError());

    const { value: advertisements } = await this.userRepository.findAllTopSellers();

    return right(advertisements);
  }
}
