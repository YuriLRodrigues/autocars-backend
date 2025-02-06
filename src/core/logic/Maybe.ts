export class Maybe<V> {
  private constructor(private readonly _value: V | null) {}

  static none<V>(): Maybe<V> {
    return new Maybe<V>(null);
  }

  static some<V>(value: V): Maybe<V> {
    return new Maybe<V>(value);
  }

  isNone = (): boolean => {
    return this._value === null;
  };

  isSome = (): boolean => {
    return this._value !== null;
  };

  get value() {
    return this._value!;
  }
}

export type AsyncMaybe<V> = Promise<Maybe<V>>;
