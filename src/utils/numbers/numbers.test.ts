import { roundDecimal, cryptoRandom, roundMax } from ".";

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

describe("cryptoRandom", () => {
  it("returns a number between 0 (inclusive) and 1 (exclusive)", () => {
    const randomNumber = cryptoRandom();
    expect(randomNumber).toBeGreaterThanOrEqual(0);
    expect(randomNumber).toBeLessThan(1);
  });
});

describe("roundMax", () => {
  it("properly rounds numbers", () => {
    expect(roundMax(8)).toBe(10); // 0 <= x < 100
    expect(roundMax(147)).toBe(150); // 100 <= x < 500
    expect(roundMax(712)).toBe(800); // 500 <= x < 1000
    expect(roundMax(1320)).toBe(1500); // 1000 <= x < 5000
    expect(roundMax(6430)).toBe(7000); // 5000 <= x
  });
});
