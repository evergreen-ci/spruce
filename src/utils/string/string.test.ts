import {
  msToDuration,
  sortFunctionDate,
  sortFunctionString,
  omitTypename,
  getDateCopy,
  applyStrictRegex,
  shortenGithash,
  trimMiddleText,
} from ".";

describe("msToDuration", () => {
  it("converts milli to 1h 20m", () => {
    const ms = 80 * 60 * 1000;
    expect(msToDuration(ms)).toBe("1h 20m");
  });

  it("converts milli to 3d 5h 20m 5s", () => {
    const ms =
      3 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000 + 20 * 60 * 1000 + 5 * 1000;
    expect(msToDuration(ms)).toBe("3d 5h 20m 5s");
  });

  it("converts milli to 5h 0m", () => {
    const ms = 5 * 60 * 60 * 1000;
    expect(msToDuration(ms)).toBe("5h 0m");
  });

  it("converts milli to 1s 20ms", () => {
    const ms = 1 * 1000 + 20;
    expect(msToDuration(ms)).toBe("1s 20ms");
  });

  it("converts milli to 12m 12s", () => {
    const ms = 12 * 60 * 1000 + 12 * 1000;
    expect(msToDuration(ms)).toBe("12m 12s");
  });

  it("converts milli to 25s", () => {
    const ms = 25000;
    expect(msToDuration(ms)).toBe("25s 0ms");
  });
});

describe("sortFunctionDate", () => {
  it("fetches correct value from object and sorts by dates", () => {
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
  it("fetches correct value from multi layered object and sorts by dates", () => {
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
  it("fetches correct value from object and sorts by alphabetical order", () => {
    const dates = [{ a: "charlie" }, { a: "alpha" }, { a: "beta" }];
    expect(dates.sort((a, b) => sortFunctionString(a, b, "a"))).toStrictEqual([
      { a: "alpha" },
      { a: "beta" },
      { a: "charlie" },
    ]);
  });
  it("fetches correct value from multi layered object and sorts by alphabetical order", () => {
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
  it("fetches correct value from object and sorts by alphabetical order regardless of case", () => {
    const dates = [{ a: "Charlie" }, { a: "Alpha" }, { a: "beta" }];
    expect(dates.sort((a, b) => sortFunctionString(a, b, "a"))).toStrictEqual([
      { a: "Alpha" },
      { a: "beta" },
      { a: "Charlie" },
    ]);
  });
});

describe("omitTypename", () => {
  it("simple object with __typename", () => {
    const obj = {
      fieldA: "test",
      fieldB: "test2",
      __typename: "simpleObj",
    };
    expect(omitTypename(obj)).toStrictEqual({
      fieldA: "test",
      fieldB: "test2",
    });
  });
  it("nested object with __typename", () => {
    const obj = {
      fieldA: "test",
      fieldB: "test2",
      someOtherObj: {
        __typename: "someOtherObj",
        fieldC: "test3",
      },
    };
    expect(omitTypename(obj)).toStrictEqual({
      fieldA: "test",
      fieldB: "test2",
      someOtherObj: {
        fieldC: "test3",
      },
    });
  });
  it("deep nested object with __typename", () => {
    const obj = {
      fieldA: "test",
      fieldB: "test2",
      someOtherObj: {
        fieldC: "test3",
        someDeepObject: {
          __typename: "someDeepObject",
          fieldD: "test4",
        },
      },
    };
    expect(omitTypename(obj)).toStrictEqual({
      fieldA: "test",
      fieldB: "test2",
      someOtherObj: {
        fieldC: "test3",
        someDeepObject: {
          fieldD: "test4",
        },
      },
    });
  });
  it("deep nested object with multiple __typename's", () => {
    const obj = {
      fieldA: "test",
      fieldB: "test2",
      someOtherObj: {
        fieldC: "test3",
        __typename: "someOtherObj",

        someDeepObject: {
          __typename: "someDeepObject",
          fieldD: "test4",
        },
      },
    };
    expect(omitTypename(obj)).toStrictEqual({
      fieldA: "test",
      fieldB: "test2",
      someOtherObj: {
        fieldC: "test3",
        someDeepObject: {
          fieldD: "test4",
        },
      },
    });
  });
  it("some object with multiple __typename's in an array", () => {
    const obj = {
      fieldA: "test",
      fieldB: "test2",
      someOtherObj: {
        fieldC: "test3",
        __typename: "someOtherObj",
        someArray: [
          {
            __typename: "someDeepObject",
            fieldD: "test4",
          },
          {
            __typename: "someDeepObject",
            fieldD: "test5",
          },
          {
            __typename: "someDeepObject",
            fieldD: "test6",
          },
        ],
      },
    };
    expect(omitTypename(obj)).toStrictEqual({
      fieldA: "test",
      fieldB: "test2",
      someOtherObj: {
        fieldC: "test3",
        someArray: [
          {
            fieldD: "test4",
          },
          {
            fieldD: "test5",
          },
          {
            fieldD: "test6",
          },
        ],
      },
    });
  });
});

describe("getDateCopy", () => {
  it("converts strings to a date with no options", () => {
    expect(getDateCopy("08/31/1996")).toBe("Aug 31, 1996, 12:00:00 AM");
    expect(getDateCopy("12-23-2014")).toBe("Dec 23, 2014, 12:00:00 AM");
    expect(getDateCopy("2020-11-16T22:17:29")).toBe(
      "Nov 16, 2020, 10:17:29 PM"
    );
  });
  it("converts strings with a supplied timezone to the users timezone", () => {
    expect(getDateCopy("2020-11-16T22:17:29z")).toBe(
      "Nov 16, 2020, 10:17:29 PM"
    );
  });
  it("converts date objects to a formatted date with no options", () => {
    expect(getDateCopy(new Date("2020-11-16T22:17:29z"))).toBe(
      "Nov 16, 2020, 10:17:29 PM"
    );
  });
  it("converts date objects to a supplied timezone", () => {
    expect(getDateCopy("2020-11-16T22:17:29", { tz: "America/New_York" })).toBe(
      "Nov 16, 2020, 5:17:29 PM"
    );
  });
  it("returns date only when supplied with the option", () => {
    expect(
      getDateCopy(new Date("2020-11-16T22:17:29z"), { dateOnly: true })
    ).toBe("Nov 16, 2020");
    expect(
      getDateCopy("2020-11-16T22:17:29", {
        tz: "America/New_York",
        dateOnly: true,
      })
    ).toBe("Nov 16, 2020");
    expect(getDateCopy("08/31/1996", { dateOnly: true })).toBe("Aug 31, 1996");
  });
});

describe("applyStrictRegex", () => {
  it("converts string to strict regex", () => {
    expect(applyStrictRegex("dog")).toBe("^dog$");
  });
  it("strict regex works as expected", () => {
    const re = new RegExp(applyStrictRegex("dog"));
    expect("d".match(re)).toBeFalsy();
    expect("do".match(re)).toBeFalsy();
    expect("dog".match(re)).toBeTruthy();
    expect("dog ".match(re)).toBeFalsy();
    expect("adog".match(re)).toBeFalsy();
  });
});

describe("shortenGithash", () => {
  it("shortens githash to 7 characters", () => {
    expect(shortenGithash("01234567")).toBe("0123456");
    expect(shortenGithash("012")).toBe("012");
  });
  it("handles undefined input", () => {
    expect(shortenGithash(undefined)).toBeUndefined();
  });
});

describe("trimMiddleText", () => {
  it("trims middle text according to specified params", () => {
    expect(trimMiddleText("task_name", 7, 3)).toBe("t...ame");
  });
  it("doesn't trim middle text if original text is smaller than maxLength specified", () => {
    expect(trimMiddleText("task_name", 10, 1)).toBe("task_name");
  });
});
