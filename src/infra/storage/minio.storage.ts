import { PutObjectCommand, S3 } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { Uploader, UploadImageParams, UploadReturn } from '@root/domain/application/repositories/uploader.repository';
import { EnvService } from '@root/infra/env/env.service';
import { randomUUID } from 'crypto';

@Injectable()
export class MinioStorage implements Uploader {
  private client: S3;

  constructor(private readonly envs: EnvService) {
    this.client = new S3({
      endpoint: this.envs.get('MINIO_BUCKET_URL'),
      apiVersion: 'latest',
      region: 'auto',
      credentials: {
        accessKeyId: this.envs.get('MINIO_ACCESS_KEY_ID'),
        secretAccessKey: this.envs.get('MINIO_SECRET_ACCESS_KEY'),
      },
      forcePathStyle: true,
    });
  }

  async uploadImage({ image }: UploadImageParams): Promise<UploadReturn> {
    const uploadId = randomUUID();
    const uniqueName = `${uploadId}-${image.fileName}`;

    const command = new PutObjectCommand({
      Bucket: this.envs.get('MINIO_BUCKET_NAME') as string,
      Key: uniqueName,
      Body: image.body,
      ContentType: image.fileType,
      ACL: 'public-read',
    });

    await this.client.send(command);

    return {
      url: `${this.envs.get('MINIO_BUCKET_URL')}/${this.envs.get('MINIO_BUCKET_NAME')}/${uniqueName}`,
      name: image.fileName,
      size: image.fileSize,
    };
  }

  // async deleteImage(params: DeleteImageParams): Promise<void> {
  //   const uniqueName = params.imageKey;

  //   const command = new DeleteObjectCommand({
  //     Bucket: this.envs.get('MINIO_BUCKET_NAME') as string,
  //     Key: uniqueName,
  //   });

  //   await this.client.send(command);
  // }
}
