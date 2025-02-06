import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';

import { AdvertisementImage } from './advertisement-image';

describe('Advertisement Image - Value Object', () => {
  it('should be able to create a new advertisement image with value object', () => {
    const output = AdvertisementImage.create({
      advertisementId: new UniqueEntityId('1'),
      imageId: new UniqueEntityId('1'),
    });

    expect(output.advertisementId).toBeInstanceOf(UniqueEntityId);
    expect(output.advertisementId.toValue()).toEqual('1');
    expect(output.imageId).toBeInstanceOf(UniqueEntityId);
    expect(output.imageId.toValue()).toEqual('1');
  });
});
