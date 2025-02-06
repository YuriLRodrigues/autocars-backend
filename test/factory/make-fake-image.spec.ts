import { ImageEntity } from '@root/domain/enterprise/entities/image.entity';

import { makeFakeImage } from './make-fake-image';

describe('Make Fake Image - Function', () => {
  it('should be able to create an fake brand automatically', () => {
    const image = makeFakeImage();

    expect(image).toBeInstanceOf(ImageEntity);
  });
});
