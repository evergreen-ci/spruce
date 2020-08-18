import {
  msToDuration,
  sortFunctionDate,
  sortFunctionString,
} from "utils/string";

describe("msToDuration", () => {
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
});

describe("sortFunctionDate", () => {
  test("fetches correct value from object and sorts by dates", () => {
    const dates = [
      { a: "2020-08-21T18:00:07Z" },
      { a: "2020-08-17T18:00:07Z" },
      { a: "2020-23-21T18:00:07Z" },
    ];
    expect(dates.sort((a, b) => sortFunctionDate(a, b, "a"))).toStrictEqual([
      { a: "2020-08-17T18:00:07Z" },
      { a: "2020-08-21T18:00:07Z" },
      { a: "2020-23-21T18:00:07Z" },
    ]);
  });
  test("fetches correct value from multi layered object and sorts by dates", () => {
    const dates = [
      { a: { b: { c: "2020-08-21T18:00:07Z" } } },
      { a: { b: { c: "2020-08-17T18:00:07Z" } } },
      { a: { b: { c: "2020-23-21T18:00:07Z" } } },
    ];
    expect(
      dates.sort((a, b) => sortFunctionDate(a, b, "a.b.c"))
    ).toStrictEqual([
      { a: { b: { c: "2020-08-17T18:00:07Z" } } },
      { a: { b: { c: "2020-08-21T18:00:07Z" } } },
      { a: { b: { c: "2020-23-21T18:00:07Z" } } },
    ]);
  });
});

describe("sortFunctionString", () => {
  test("fetches correct value from object and sorts by alphabetical order", () => {
    const dates = [{ a: "charlie" }, { a: "alpha" }, { a: "beta" }];
    expect(dates.sort((a, b) => sortFunctionString(a, b, "a"))).toStrictEqual([
      { a: "alpha" },
      { a: "beta" },
      { a: "charlie" },
    ]);
  });
  test("fetches correct value from multi layered object and sorts by alphabetical order", () => {
    const dates = [
      { a: { b: { c: "charlie" } } },
      { a: { b: { c: "alpha" } } },
      { a: { b: { c: "beta" } } },
    ];
    expect(
      dates.sort((a, b) => sortFunctionString(a, b, "a.b.c"))
    ).toStrictEqual([
      { a: { b: { c: "alpha" } } },
      { a: { b: { c: "beta" } } },
      { a: { b: { c: "charlie" } } },
    ]);
  });
  test("fetches correct value from object and sorts by alphabetical order regardless of case", () => {
    const dates = [{ a: "Charlie" }, { a: "Alpha" }, { a: "beta" }];
    expect(dates.sort((a, b) => sortFunctionString(a, b, "a"))).toStrictEqual([
      { a: "Alpha" },
      { a: "beta" },
      { a: "Charlie" },
    ]);
  });
});
