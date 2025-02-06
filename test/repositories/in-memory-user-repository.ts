import { PaginatedResult } from '@root/core/dto/paginated-result';
import { AsyncMaybe, Maybe } from '@root/core/logic/Maybe';
import {
  DeleteProps,
  FindAllUsersProps,
  FindByEmailProps,
  FindByIdProps,
  FindByUsernameProps,
  meProps,
  RegisterProps,
  SaveProps,
  UserRepository,
} from '@root/domain/application/repositories/user.repository';
import { UserEntity, UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { TopSellerDetails } from '@root/domain/enterprise/value-object/top-seller-details';

import { InMemoryAdvertisementRepository } from './in-memory-advertisement-repository';

export class InMemoryUserRepository implements UserRepository {
  constructor(private readonly inMemoryAdvertisementRepository: InMemoryAdvertisementRepository) {}

  public users: UserEntity[] = [];

  async findByUsername({ username }: FindByUsernameProps): AsyncMaybe<UserEntity> {
    const user = this.users.find((u) => u.username === username);

    if (!user) return Maybe.none();

    return Maybe.some(user);
  }

  async me({ userId }: meProps): AsyncMaybe<UserEntity> {
    const user = this.users.find((u) => u.id.equals(userId));

    if (!user) return Maybe.none();

    return Maybe.some(user);
  }

  async findById({ id }: FindByIdProps): AsyncMaybe<UserEntity> {
    const user = this.users.find((u) => u.id.equals(id));

    if (!user) return Maybe.none();

    return Maybe.some(user);
  }

  async findByEmail({ email }: FindByEmailProps): AsyncMaybe<UserEntity> {
    const user = this.users.find((u) => u.email === email);

    if (!user) return Maybe.none();

    return Maybe.some(user);
  }

  async findAllUsers({ limit, page }: FindAllUsersProps): AsyncMaybe<PaginatedResult<UserEntity[]>> {
    return Maybe.some({
      data: this.users.slice((page - 1) * limit, page * limit),
      meta: {
        page,
        perPage: limit,
        totalPages: Math.ceil(this.users.length / limit),
        totalCount: this.users.length,
      },
    });
  }

  async findAllTopSellers(): AsyncMaybe<TopSellerDetails[]> {
    const topSellers = this.users
      .filter((user) => user.roles.includes(UserRoles.Seller))
      .sort((a, b) => {
        const soldAdvertisementsA = this.inMemoryAdvertisementRepository.advertisements
          .filter((ad) => ad.soldStatus === 'Sold' && ad.userId.toValue() === a.id.toValue())
          .reduce((sum, adv) => sum + adv.price, 0);

        const soldAdvertisementsB = this.inMemoryAdvertisementRepository.advertisements
          .filter((ad) => ad.soldStatus === 'Sold' && ad.userId.toValue() === b.id.toValue())
          .reduce((sum, adv) => sum + adv.price, 0);

        return soldAdvertisementsB - soldAdvertisementsA;
      });

    const mappedTopSellers = topSellers.map((seller) =>
      TopSellerDetails.create({
        id: seller.id,
        name: seller.name,
        profileImg: seller.avatar,
        amountSold: this.inMemoryAdvertisementRepository.advertisements.filter(
          (ad) => ad.soldStatus === 'Sold' && ad.userId.toValue() === seller.id.toValue(),
        ).length,
        roles: seller.roles,
        quantitySold: this.inMemoryAdvertisementRepository.advertisements
          .filter((ad) => ad.userId.toValue() === seller.id.toValue() && ad.soldStatus === 'Sold')
          .reduce((sum, ad) => sum + (ad?.salePrice || ad.price), 0),
      }),
    );

    return Maybe.some(mappedTopSellers.slice(0, 5));
  }

  async register({ user }: RegisterProps): AsyncMaybe<UserEntity> {
    this.users.push(user);

    return Maybe.some(user);
  }

  async save({ user }: SaveProps): AsyncMaybe<UserEntity> {
    const index = this.users.findIndex((u) => u.id === user.id);

    this.users[index] = user;

    return Maybe.some(this.users[index]);
  }

  async delete({ userId }: DeleteProps): AsyncMaybe<void> {
    this.users = this.users.filter((u) => u.id.toValue() !== userId.toValue());

    return Maybe.none();
  }
}
