import { Injectable } from '@nestjs/common';
import { SoldStatus } from '@prisma/client';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
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

import { UserMappers } from '../mappers/user.mappers';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async me({ userId }: meProps): AsyncMaybe<UserEntity> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId.toValue(),
      },
    });

    if (!user) {
      return Maybe.none();
    }

    const mappedUser = UserMappers.toDomain(user);

    return Maybe.some(mappedUser);
  }

  async findAllUsers({
    limit,
    page,
    createdAt,
    name,
    role,
    status,
    title,
  }: FindAllUsersProps): AsyncMaybe<PaginatedResult<UserEntity[]>> {
    const orderBy: Record<string, 'asc' | 'desc'>[] = [];

    if (createdAt) orderBy.push({ createdAt });

    if (name) orderBy.push({ name });

    const [count, users] = await this.prismaService.$transaction([
      this.prismaService.user.count({
        where: {
          name: {
            contains: title ? title.toUpperCase() : undefined,
            mode: 'insensitive',
          },
          roles: role ? { hasSome: [role] } : undefined,
          disabled: status && status === 'ACTIVE' ? null : { not: null },
        },
      }),
      this.prismaService.user.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: orderBy.length > 0 ? orderBy : undefined,
        where: {
          name: {
            contains: title ? title.toUpperCase() : undefined,
            mode: 'insensitive',
          },
          roles: role ? { hasSome: [role] } : undefined,
          disabled: status ? (status === 'ACTIVE' ? null : { not: null }) : undefined,
        },
      }),
    ]);

    const mappedUsers = users.map((user) => UserMappers.toDomain(user));

    return Maybe.some({
      data: mappedUsers,
      meta: {
        page,
        perPage: limit,
        totalPages: Math.ceil(count / limit),
        totalCount: count,
      },
    });
  }

  async findByUsername({ username }: FindByUsernameProps): AsyncMaybe<UserEntity | null> {
    const user = await this.prismaService.user.findUnique({
      where: {
        username,
      },
    });

    if (!user) {
      return Maybe.none();
    }

    const mappedUser = UserMappers.toDomain(user);

    return Maybe.some(mappedUser);
  }

  async findById({ id }: FindByIdProps): AsyncMaybe<UserEntity | null> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: id.toValue(),
      },
    });

    if (!user) {
      return Maybe.none();
    }

    const mappedUser = UserMappers.toDomain(user);

    return Maybe.some(mappedUser);
  }

  async findByEmail({ email }: FindByEmailProps): AsyncMaybe<UserEntity | null> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return Maybe.none();
    }

    const mappedUser = UserMappers.toDomain(user);

    return Maybe.some(mappedUser);
  }

  async register({ user }: RegisterProps): AsyncMaybe<UserEntity> {
    const raw = UserMappers.toPersistence(user);

    const createdUser = await this.prismaService.user.create({
      data: raw,
    });

    const mappedUser = UserMappers.toDomain(createdUser);

    return Maybe.some(mappedUser);
  }

  async findAllTopSellers(): AsyncMaybe<TopSellerDetails[]> {
    const sellers = await this.prismaService.user.findMany({
      where: { roles: { hasSome: [UserRoles.Seller, UserRoles.Manager] } },
      select: {
        id: true,
        avatar: true,
        name: true,
        roles: true,
        advertisement: {
          where: { soldStatus: SoldStatus.Sold },
          select: {
            price: true,
            salePrice: true,
          },
        },
        _count: {
          select: {
            advertisement: {
              where: { soldStatus: SoldStatus.Sold },
            },
          },
        },
      },
      orderBy: {
        advertisement: {
          _count: 'desc',
        },
      },
    });

    const mappedTopSellers = sellers
      .map((seller) => {
        const totalAmountSold = seller.advertisement.reduce((sum, ad) => sum + (ad.salePrice ?? ad.price), 0);

        return TopSellerDetails.create({
          id: new UniqueEntityId(seller.id),
          profileImg: seller.avatar,
          name: seller.name,
          roles: seller.roles as UserRoles[],
          amountSold: totalAmountSold,
          quantitySold: seller._count.advertisement,
        });
      })
      .slice(0, 5);

    return Maybe.some(mappedTopSellers);
  }

  async save({ user }: SaveProps): AsyncMaybe<UserEntity> {
    const raw = UserMappers.toPersistence(user);

    const updatedUser = await this.prismaService.user.update({
      where: {
        id: raw.id,
      },
      data: raw,
    });

    const mappedUser = UserMappers.toDomain(updatedUser);

    return Maybe.some(mappedUser);
  }

  async delete({ userId }: DeleteProps): AsyncMaybe<void> {
    await this.prismaService.user.delete({
      where: {
        id: userId.toValue(),
      },
    });

    return;
  }
}
