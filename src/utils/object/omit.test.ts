import { omit } from "utils/object";

describe("omit", () => {
  it("returns an object without the supplied key(s)", () => {
    expect(omit({} as { a?: number }, ["a"])).toMatchObject({});
    expect(omit({ a: 1 }, ["a"])).toMatchObject({});
    expect(omit({ a: 1, b: 1 }, ["b"])).toMatchObject({ a: 1 });
    expect(omit({ a: 1, b: 1, c: 1 }, ["b", "c"])).toMatchObject({ a: 1 });
  });
  it("returns a new object reference", () => {
    const inputObj = {};
    const resultObj = omit<{ b?: number }, ["b"]>(inputObj, ["b"]);
    expect(resultObj).toMatchObject(inputObj);
    expect(resultObj).not.toBe(inputObj);
  });
});
