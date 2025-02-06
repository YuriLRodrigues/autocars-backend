import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { AddressEntity } from '@root/domain/enterprise/entities/address.entity';

type Overwrides = Partial<AddressEntity>;

export const makeFakeAddress = (data = {} as Overwrides) => {
  const city = faker.location.city();
  const country = faker.location.country();
  const state = faker.location.state();
  const street = faker.location.street();
  const neighborhood = faker.lorem.word(1);
  const zipCode = faker.number.int({ min: 111111, max: 999999 });
  const userId = new UniqueEntityId();
  const id = new UniqueEntityId();

  return AddressEntity.create(
    {
      city: data.city || city,
      country: data.country || country,
      neighborhood: data.neighborhood || neighborhood,
      state: data.state || state,
      street: data.street || street,
      zipCode: data.zipCode || zipCode,
      createdAt: data.createdAt || faker.date.past(),
      userId: data.userId || userId,
      updatedAt: data.updatedAt || faker.date.recent(),
    },
    data.id || id,
  );
};
