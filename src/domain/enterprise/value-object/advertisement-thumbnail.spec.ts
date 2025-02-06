import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';

import { AdvertisementThumbnail } from './advertisement-thumbnail';

describe('Advertisement Thumbnail - Value Object', () => {
  it('should be able to create a new advertisement thumbanil with value object', () => {
    const output = AdvertisementThumbnail.create({
      advertisementId: new UniqueEntityId('1'),
      thumbnailId: new UniqueEntityId('1'),
    });

    expect(output.advertisementId).toBeInstanceOf(UniqueEntityId);
    expect(output.advertisementId.toValue()).toEqual('1');
    expect(output.thumbnailId).toBeInstanceOf(UniqueEntityId);
    expect(output.thumbnailId.toValue()).toEqual('1');
  });
});
