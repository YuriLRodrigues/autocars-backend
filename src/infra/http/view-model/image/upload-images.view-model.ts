import { ImageEntity } from '@root/domain/enterprise/entities/image.entity';

export class UploadImagesViewModel {
  static toHttp(image: ImageEntity) {
    return {
      id: image.id.toValue(),
      url: image.url,
      blurHash: image.blurHash,
      createdAt: image.createdAt,
      updatedAt: image.updatedAt,
    };
  }
}
