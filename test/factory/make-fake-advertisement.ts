import { faker } from '@faker-js/faker';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import {
  AdvertisementEntity,
  Capacity,
  Color,
  Doors,
  Fuel,
  GearBox,
  Model,
  SoldStatus,
} from '@root/domain/enterprise/entities/advertisement.entity';

type Overwrides = Partial<AdvertisementEntity>;

export const makeFakeAdvertisement = (data = {} as Overwrides) => {
  const brandId = new UniqueEntityId();
  const id = new UniqueEntityId();
  const capacity = Capacity.Two;
  const color = Color.Black;
  const createdAt = faker.date.recent();
  const description = faker.lorem.lines(2);
  const doors = Doors.Four;
  const fuel = Fuel.Gasoline;
  const gearBox = GearBox.Manual;
  const km = faker.number.float();
  const localization = faker.location.state();
  const model = Model.SUV;
  const phone = faker.phone.number();
  const price = faker.number.float({ min: 10, max: 100000 });
  const thumbnailUrl = faker.internet.url();
  const title = faker.lorem.slug();
  const userId = new UniqueEntityId();
  const year = 2024;
  const details = [''];
  const salePrice = faker.number.float();
  const soldStatus = SoldStatus.Active;
  const updatedAt = faker.date.past();

  return AdvertisementEntity.create(
    {
      brandId: data.brandId || brandId,
      capacity: data.capacity || capacity,
      color: data.color || color,
      createdAt: data.createdAt || createdAt,
      description: data.description || description,
      doors: data.doors || doors,
      fuel: data.fuel || fuel,
      gearBox: data.gearBox || gearBox,
      km: data.km || km,
      localization: data.localization || localization,
      model: data.model || model,
      phone: data.phone || phone,
      price: data.price || price,
      thumbnailUrl: data.thumbnailUrl || thumbnailUrl,
      title: data.title || title,
      userId: data.userId || userId,
      year: data.year || year,
      details: data.details || details,
      salePrice: data.salePrice || salePrice,
      updatedAt: data.updatedAt || updatedAt,
      soldStatus: data.soldStatus || soldStatus,
    },
    data.id || id,
  );
};
