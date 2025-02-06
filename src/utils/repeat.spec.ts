import { repeat } from './repeat';

describe('Repeat - Function', () => {
  it('should be able to execute reapeat funtion', () => {
    let sum: number = 0;

    repeat(5, () => {
      sum += 1;
    });

    expect(sum).toBe(5);
  });
});
