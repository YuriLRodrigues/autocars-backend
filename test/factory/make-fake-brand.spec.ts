import { BrandEntity } from '@root/domain/enterprise/entities/brand.entity';

import { makeFakeBrand } from './make-fake-brand';

describe('Make Fake Brand - Function', () => {
  it('should be able to create an fake brand automatically', () => {
    const brand = makeFakeBrand();

    expect(brand).toBeInstanceOf(BrandEntity);
  });
});
