import { stringifyQuery, stringifyQueryAsValue } from "./stringifyQuery";

describe("stringifyQuery", () => {
  it("should return an empty string for an empty object", () => {
    const result = stringifyQuery({});
    expect(result).toBe("");
  });

  it("should return a string with one key-value pair for an object with one property", () => {
    const result = stringifyQuery({ foo: "bar" });
    expect(result).toBe("foo=bar");
  });

  it("should handle objects with multiple properties", () => {
    const result = stringifyQuery({ baz: 42, foo: "bar" });
    expect(result).toBe("baz=42&foo=bar");
  });

  it("should handle array properties with comma notation", () => {
    const result = stringifyQuery({ foo: ["bar", "baz"] });
    expect(result).toBe("foo=bar,baz");
  });
});

describe("stringifyQueryAsValue", () => {
  it("should skip null properties", () => {
    const result = stringifyQueryAsValue({ baz: null, foo: "bar" });
    expect(result).toBe("foo=bar");
  });

  it("should handle objects with multiple properties", () => {
    const result = stringifyQueryAsValue({ baz: 42, foo: "bar" });
    expect(result).toBe("baz=42&foo=bar");
  });

  it("should handle array properties with comma notation", () => {
    const result = stringifyQueryAsValue({ foo: ["bar", "baz"], qux: null });
    expect(result).toBe("foo=bar,baz");
  });
  it("should skip empty strings", () => {
    const result = stringifyQueryAsValue({ bar: null, foo: "" });
    expect(result).toBe("");
  });
  it("should preserve empty strings if skipEmptyString is passed in", () => {
    let result = stringifyQueryAsValue(
      { bar: null, foo: "" },
      { skipEmptyString: false }
    );
    expect(result).toBe("foo=");
    result = stringifyQueryAsValue(
      { bar: 21, foo: "" },
      { skipEmptyString: false }
    );
    expect(result).toBe("bar=21&foo=");
  });
});
