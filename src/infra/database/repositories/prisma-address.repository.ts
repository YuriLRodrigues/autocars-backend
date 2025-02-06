import { Injectable } from '@nestjs/common';
import { AsyncMaybe, Maybe } from '@root/core/logic/Maybe';
import {
  AddressRepository,
  CreateProps,
  FindByUserIdProps,
} from '@root/domain/application/repositories/address.repository';
import { AddressEntity } from '@root/domain/enterprise/entities/address.entity';

import { AddressMappers } from '../mappers/address.mappers';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaAddressRepository implements AddressRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async create({ address }: CreateProps): Promise<void> {
    const raw = AddressMappers.toPersistence(address);

    await this.prismaService.address.create({ data: raw });
  }
  async save({ address }: CreateProps): Promise<void> {
    const raw = AddressMappers.toPersistence(address);

    await this.prismaService.address.update({
      data: raw,
      where: {
        id: raw.id,
      },
    });
  }
  async findByUserId({ id }: FindByUserIdProps): AsyncMaybe<AddressEntity> {
    const address = await this.prismaService.address.findUnique({
      where: {
        userId: id.toValue(),
      },
    });

    if (!address) return Maybe.none();

    return Maybe.some(AddressMappers.toDomain(address));
  }
}
