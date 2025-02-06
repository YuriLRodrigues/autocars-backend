import { AdvertisementEntity } from '@root/domain/enterprise/entities/advertisement.entity';

import { makeFakeAdvertisement } from './make-fake-advertisement';

describe('Make Fake Advertisement - Function', () => {
  it('should be able to create an fake advertisement automatically', () => {
    const ad = makeFakeAdvertisement();

    expect(ad).toBeInstanceOf(AdvertisementEntity);
  });
});
