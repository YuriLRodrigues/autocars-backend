import { UseCaseError } from '@root/core/errors/use-case-error';

export class ImageTypeError extends Error implements UseCaseError {
  constructor(message?: string) {
    super(message ?? 'Invalid image type');
    this.name = 'ImageTypeError';
  }
}
