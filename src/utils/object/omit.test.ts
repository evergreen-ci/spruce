import { omit } from "utils/object";

describe("omit", () => {
  it("returns a new object without the supplied key", () => {
    expect(omit<{ b?: number }, ["b"]>({}, ["b"])).toMatchObject({});
    expect(omit({ a: 1 }, ["a"])).toMatchObject({});
  });
  it("returns a new object reference even when the input and outupt object have deep equality", () => {
    const inputObj = {};
    const resultObj = omit<{ b?: number }, ["b"]>(inputObj, ["b"]);
    expect(resultObj).toMatchObject(inputObj);
    expect(resultObj).not.toBe(inputObj);
  });
});
