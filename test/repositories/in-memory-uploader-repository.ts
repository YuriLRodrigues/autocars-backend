import { Uploader, UploadImageParams, UploadReturn } from '@root/domain/application/repositories/uploader.repository';
import { randomUUID } from 'crypto';

export class InMemoryUploaderRepository implements Uploader {
  async uploadImage({ image }: UploadImageParams): Promise<UploadReturn> {
    const uploadId = randomUUID();

    const uniqueName = `${uploadId}-${image.fileName}`;

    return {
      url: uniqueName,
      name: image.fileName,
      size: image.fileSize,
    };
  }
}
