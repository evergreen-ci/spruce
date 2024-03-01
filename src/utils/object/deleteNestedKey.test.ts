import { deleteNestedKey } from "./deleteNestedKey";

describe("deleteNestedKey", () => {
  it("deletes a top-level key", () => {
    const obj = {
      name: "John",
      age: 30,
      city: "New York",
    };
    const expected = {
      name: "John",
      city: "New York",
    };
    expect(deleteNestedKey(obj, "age")).toStrictEqual(expected);
  });

  it("deletes a nested key", () => {
    const obj = {
      name: "John",
      address: {
        city: "New York",
        zipCode: 10001,
        age: 5,
      },
    };
    const expected = {
      name: "John",
      address: {
        city: "New York",
        zipCode: 10001,
      },
    };
    expect(deleteNestedKey(obj, "age")).toStrictEqual(expected);
  });

  it("handles multiple nested levels", () => {
    const obj = {
      name: "John",
      age: 30,
      address: {
        city: "New York",
        details: {
          zipCode: 10001,
          age: 5,
        },
      },
    };
    const expected = {
      name: "John",
      address: {
        city: "New York",
        details: {
          zipCode: 10001,
        },
      },
    };
    expect(deleteNestedKey(obj, "age")).toStrictEqual(expected);
  });

  it("does not delete non-matching keys", () => {
    const obj = {
      name: "John",
      age: 30,
      address: {
        city: "New York",
        zipCode: 10001,
      },
    };
    const expected = { ...obj };
    expect(deleteNestedKey(obj, "height")).toStrictEqual(expected);
  });
});
