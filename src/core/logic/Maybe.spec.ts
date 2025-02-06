import { Maybe } from './Maybe';

describe('Maybe', () => {
  it('should be able to check if data is valid (exist)', () => {
    const maybeTest = Maybe.some(1);

    expect(maybeTest.isSome()).toBe(true);
    expect(maybeTest.isNone()).toBe(false);
    expect(maybeTest.value).toBe(1);
  });

  it('should be able to check if data is invalid (not exist)', () => {
    const maybeTest = Maybe.none();

    expect(maybeTest.isNone()).toBe(true);
    expect(maybeTest.isSome()).toBe(false);
    expect(maybeTest.value).toBe(null);
  });
});
