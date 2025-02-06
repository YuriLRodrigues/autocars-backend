export const repeat = (times: number, fn: (index: number) => void) => {
  for (let i = 0; i < times; i++) {
    fn(i);
  }
};
