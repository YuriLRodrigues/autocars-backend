export type UploadParams = {
  fileName: string;
  fileType: string;
  fileSize: number;
  body: Buffer;
};

export type UploadImageParams = {
  image: UploadParams;
};

export type DeleteImageParams = {
  imageKey: string;
};

export type DeleteManyImagesParams = {
  images: UploadParams[];
};

export type UploadReturn = {
  url: string;
  size: number;
  name: string;
};

export abstract class Uploader {
  abstract uploadImage(params: UploadImageParams): Promise<UploadReturn>;
  // abstract deleteImage(params: DeleteImageParams): Promise<void>;
  // abstract deleteManyImages(params: DeleteManyImagesParams): Promise<void>;
}
