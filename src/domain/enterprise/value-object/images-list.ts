import { WatchedList } from '@root/core/logic/watched-list';

import { ImageEntity } from '../entities/image.entity';

export class ImagesList extends WatchedList<ImageEntity> {
  compareItems(a: ImageEntity, b: ImageEntity): boolean {
    return a.id.equals(b.id);
  }
}
