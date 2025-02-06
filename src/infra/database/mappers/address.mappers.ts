import { Address, Prisma } from '@prisma/client';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { AddressEntity } from '@root/domain/enterprise/entities/address.entity';

export class AddressMappers {
  static toDomain(data: Address): AddressEntity {
    return AddressEntity.create(
      {
        street: data.street,
        city: data.city,
        neighborhood: data.neighborhood,
        state: data.state,
        zipCode: data.zipCode,
        country: data.country,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        userId: new UniqueEntityId(data.userId),
      },
      new UniqueEntityId(data.id),
    );
  }

  static toPersistence(data: AddressEntity): Prisma.AddressCreateInput {
    return {
      id: data.id.toValue(),
      street: data.street,
      city: data.city,
      neighborhood: data.neighborhood,
      state: data.state,
      zipCode: data.zipCode,
      country: data.country,
      user: {
        connect: {
          id: data.userId.toValue(),
        },
      },
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  }
}
