import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';

import { ImageEntity } from './image.entity';

describe('Image - Entity', () => {
  it('should be able to create an image without a thumbnail', () => {
    const output = ImageEntity.create({
      url: 'url-test',
      blurHash: 'blur-hash',
      advertisementId: new UniqueEntityId(),
      userId: new UniqueEntityId(),
      isAvatar: true,
      isThumbnail: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    expect(output.id).toBeInstanceOf(UniqueEntityId);
    expect(output.url).toBe('url-test');
    expect(output.createdAt).toBeInstanceOf(Date);
    expect(output.blurHash).toEqual('blur-hash');
    expect(output.updatedAt).toBeInstanceOf(Date);
    expect(output.advertisementId).toBeInstanceOf(UniqueEntityId);
    expect(output.isThumbnail).toBe(false);
    expect(output.isAvatar).toBe(true);
  });

  it('should be able to create an image with a thumbnail', () => {
    const output = ImageEntity.create({
      url: 'url-test',
      blurHash: 'blur-hash',
      advertisementId: new UniqueEntityId(),
      userId: new UniqueEntityId(),
      isAvatar: false,
      isThumbnail: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    expect(output.id).toBeInstanceOf(UniqueEntityId);
    expect(output.url).toBe('url-test');
    expect(output.blurHash).toEqual('blur-hash');
    expect(output.createdAt).toBeInstanceOf(Date);
    expect(output.updatedAt).toBeInstanceOf(Date);
    expect(output.advertisementId).toBeInstanceOf(UniqueEntityId);
    expect(output.isThumbnail).toBe(true);
    expect(output.isAvatar).toBe(false);
  });
});
