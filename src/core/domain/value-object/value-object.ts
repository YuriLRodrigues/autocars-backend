export abstract class ValueObject<T> {
  public props: T;

  protected constructor(props: T) {
    this.props = props;
  }
}
