import { roundDecimal } from ".";

describe("roundDecimal", () => {
  it("correctly rounds a decimal to the specified number of places", () => {
    expect(roundDecimal(0.1756, 1)).toBe(0.2);
    expect(roundDecimal(0.1756, 2)).toBe(0.18);
    expect(roundDecimal(0.1756, 3)).toBe(0.176);
  });
  it("does not add trailing zeroes", () => {
    expect(roundDecimal(11, 3)).toBe(11);
    expect(roundDecimal(4.2, 3)).toBe(4.2);
  });
});
