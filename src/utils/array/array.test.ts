import {
  toggleArray,
  convertArrayToObject,
  convertObjectToArray,
  mapStringArrayToObject,
} from ".";

describe("toggleArray", () => {
  test("Should add an element to the array if the array is empty", () => {
    expect(toggleArray(1, [])).toStrictEqual([1]);
    expect(toggleArray("Mohamed", [])).toStrictEqual(["Mohamed"]);
  });
  test("Should remove an element from the array if it already exists", () => {
    expect(toggleArray(1, [1])).toStrictEqual([]);
    expect(toggleArray("Arjun", ["Arjun"])).toStrictEqual([]);
    expect(toggleArray(1, [1, 2])).toStrictEqual([2]);
    expect(toggleArray("Chaya", ["Chaya", "Arjun"])).toStrictEqual(["Arjun"]);
  });
  test("Should handle objects", () => {
    expect(toggleArray({ someArray: 1 }, [])).toStrictEqual([{ someArray: 1 }]);
    expect(toggleArray({ someArray: 1 }, [{ someArray: 1 }])).toStrictEqual([]);
    expect(toggleArray({ someArray: 1 }, [{ someArray: 2 }])).toStrictEqual([
      { someArray: 2 },
      { someArray: 1 },
    ]);
  });
});

describe("convertObjectToArray", () => {
  test("Should return an empty array for an empty object", () => {
    expect(convertObjectToArray({})).toStrictEqual([]);
    expect(convertObjectToArray(undefined)).toStrictEqual([]);
  });
  test("Should split out singular array values in objects into an array of their own objects", () => {
    expect(convertObjectToArray({ a: [1], b: [2] })).toStrictEqual([
      { key: "a", value: 1 },
      { key: "b", value: 2 },
    ]);
  });
  test("Should split out array values with multiple elements in objects into an array of their own objects", () => {
    expect(convertObjectToArray({ a: [1, 2, 3], b: [4, 5, 6] })).toStrictEqual([
      { key: "a", value: 1 },
      { key: "a", value: 2 },
      { key: "a", value: 3 },
      { key: "b", value: 4 },
      { key: "b", value: 5 },
      { key: "b", value: 6 },
    ]);
  });
});

describe("convertArrayToObject", () => {
  test("Should return an empty object if provided with an empty array", () => {
    expect(convertArrayToObject([], "someKey")).toStrictEqual({});
    expect(convertArrayToObject(undefined, "someKey")).toStrictEqual({});
  });
  test("Should take a singular array element and return an object with one element", () => {
    const element = { key: "aKey", value: 1 };
    expect(convertArrayToObject([element], "key")).toStrictEqual({
      aKey: { key: "aKey", value: 1 },
    });
  });
  test("Should take a array with many elements and return an object with many element", () => {
    const element1 = { key: "aKey", value: 1 };
    const element2 = { key: "bKey", value: 2 };
    const element3 = { key: "cKey", value: 3 };

    expect(
      convertArrayToObject([element1, element2, element3], "key")
    ).toStrictEqual({
      aKey: element1,
      bKey: element2,
      cKey: element3,
    });
  });
  test("Should use the most recent object when there is a key name collision", () => {
    const element1 = { key: "aKey", value: 1 };
    const element2 = { key: "bKey", value: 2 };
    const element3 = { key: "aKey", value: 3 };

    expect(
      convertArrayToObject([element1, element2, element3], "key")
    ).toStrictEqual({
      aKey: element3,
      bKey: element2,
    });
  });
  test("Should not add any elements when there is no matching key", () => {
    const element1 = { key: "aKey", value: 1 };
    const element2 = { key: "bKey", value: 2 };
    const element3 = { key: "cKey", value: 3 };

    expect(
      convertArrayToObject([element1, element2, element3], "keyDNE")
    ).toStrictEqual({});
  });
});

describe("mapStringArrayToObject", () => {
  test("Should convert a string array to an array of key value pairs", () => {
    const someArray = ["keyA", "keyB", "keyC", "keyD"];
    expect(mapStringArrayToObject(someArray, "Value")).toStrictEqual({
      keyA: "Value",
      keyB: "Value",
      keyC: "Value",
      keyD: "Value",
    });
    expect(mapStringArrayToObject(someArray, true)).toStrictEqual({
      keyA: true,
      keyB: true,
      keyC: true,
      keyD: true,
    });
  });

  test("Should handle functions for passed in values", () => {
    const someArray = ["keyA", "keyB", "keyC", "keyD"];
    const someFunc = (v: string) => v.toUpperCase();
    expect(mapStringArrayToObject(someArray, someFunc)).toStrictEqual({
      keyA: "KEYA",
      keyB: "KEYB",
      keyC: "KEYC",
      keyD: "KEYD",
    });
  });
});
