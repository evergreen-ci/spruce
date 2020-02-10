import { msToDuration } from "utils/string";

test("converts milli to 1h 20m", () => {
  const ms = 80 * 60 * 1000;
  expect(msToDuration(ms)).toBe("1h 20m");
});

test("converts milli to 3d 5h 20m 5s", () => {
  const ms =
    3 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000 + 20 * 60 * 1000 + 5 * 1000;
  expect(msToDuration(ms)).toBe("3d 5h 20m 5s");
});

test("converts milli to 5h 0m", () => {
  const ms = 5 * 60 * 60 * 1000;
  expect(msToDuration(ms)).toBe("5h 0m");
});

test("converts milli to 1s 20ms", () => {
  const ms = 1 * 1000 + 20;
  expect(msToDuration(ms)).toBe("1s 20ms");
});

test("converts milli to 12m 12s", () => {
  const ms = 12 * 60 * 1000 + 12 * 1000;
  expect(msToDuration(ms)).toBe("12m 12s");
});

test("converts milli to 25s", () => {
  const ms = 25000;
  expect(msToDuration(ms)).toBe("25s 0ms");
});
