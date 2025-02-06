import { UniqueEntityId } from './unique-id.entity';

export abstract class Entity<T> {
  protected _id: UniqueEntityId;
  public props: T;

  public get id() {
    return this._id;
  }

  protected constructor(props: T, id?: UniqueEntityId) {
    this.props = props;
    this._id = id ?? new UniqueEntityId();
  }

  public equals(object?: Entity<T>): boolean {
    if (object === null || object === undefined) {
      return false;
    }

    if (this === object) {
      return true;
    }

    if (!(object instanceof Entity)) {
      return false;
    }

    return this._id === object._id;
  }
}
