import { Entity } from '@root/core/domain/entity/entity';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { Optional } from '@root/core/logic/Optional';

type ImageEntityProps = {
  url: string;
  blurHash: string;
  advertisementId?: UniqueEntityId;
  isThumbnail?: boolean;
  isAvatar?: boolean;
  userId: UniqueEntityId;
  createdAt: Date;
  updatedAt?: Date;
};

type EditImageInfoProps = {
  url?: string;
  blurHash?: string;
  advertisementId?: UniqueEntityId;
  isThumbnail?: boolean;
  isAvatar?: boolean;
  updatedAt?: Date;
};

export class ImageEntity extends Entity<ImageEntityProps> {
  get url() {
    return this.props.url;
  }

  get advertisementId() {
    return this.props.advertisementId;
  }

  get isThumbnail() {
    return this.props.isThumbnail;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get blurHash() {
    return this.props.blurHash;
  }

  get isAvatar() {
    return this.props.isAvatar;
  }

  get userId() {
    return this.props.userId;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  set url(value: string) {
    this.props.url = value;
  }

  set blurHash(value: string) {
    this.props.blurHash = value;
  }

  set advertisementId(value: UniqueEntityId) {
    this.props.advertisementId = value;
  }

  set isThumbnail(value: boolean) {
    this.props.isThumbnail = value;
  }

  static create(props: Optional<ImageEntityProps, 'createdAt' | 'isThumbnail'>, id?: UniqueEntityId) {
    const image = new ImageEntity(
      {
        advertisementId: props.advertisementId,
        isThumbnail: props.isThumbnail || false,
        isAvatar: props.isAvatar,
        userId: props.userId,
        url: props.url,
        blurHash: props.blurHash,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    );

    return image;
  }

  public editInfo(props: EditImageInfoProps): ImageEntity {
    this.props.url = props.url ?? this.props.url;
    this.props.isAvatar = props.isAvatar ?? this.props.isAvatar;
    this.props.blurHash = props.blurHash ?? this.props.blurHash;
    this.props.advertisementId = props.advertisementId ?? this.props.advertisementId;
    this.props.isThumbnail = props.isThumbnail ?? this.props.isThumbnail;
    this.props.updatedAt = props.updatedAt ?? new Date();

    return this;
  }
}
