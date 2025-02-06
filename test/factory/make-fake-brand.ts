import { faker } from '@faker-js/faker';
import { BrandEntity } from '@root/domain/enterprise/entities/brand.entity';

type Overwrides = Partial<BrandEntity>;

export const makeFakeBrand = (data = {} as Overwrides) => {
  const logoUrl = faker.internet.url();
  const name = faker.vehicle.model();
  const createdAt = faker.date.past();
  const updatedAt = faker.date.recent();

  return BrandEntity.create({
    logoUrl: data.logoUrl ?? logoUrl,
    name: data.name || name,
    createdAt: data.createdAt || createdAt,
    updatedAt: data.updatedAt || updatedAt,
  });
};
