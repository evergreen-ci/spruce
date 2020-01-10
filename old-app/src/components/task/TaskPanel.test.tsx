import { stringifyMilliseconds } from "./TaskPanel";

describe("TaskPanel", () => {
  it("check stringifyMilliseconds correctly handles valid input with skip max", () => {
    expect(stringifyMilliseconds(0, true, true)).toBe("0 seconds");
    expect(stringifyMilliseconds(500, true, true)).toBe("500 ms");
    expect(stringifyMilliseconds(5000, true, true)).toBe("5 seconds");
    expect(stringifyMilliseconds(127414, true, true)).toBe("2m 7s");
    expect(stringifyMilliseconds(7200000, true, true)).toBe("2h 0m 0s");
  });

  it("check stringifyMilliseconds correctly handles valid input with skip max", () => {
    expect(stringifyMilliseconds(500, false, false)).toBe("< 1 second");
    expect(stringifyMilliseconds(1000 * 60 * 60 * 48, false, false)).toBe(
      ">= 1 day"
    );
  });

  it("check stringifyMilliseconds correctly handles invalid input", () => {
    expect(stringifyMilliseconds("some string", true, true)).toBe("unknown");
  });
});
