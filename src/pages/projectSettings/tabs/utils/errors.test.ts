import { findDuplicateIndices } from "./errors";

describe("findDuplicateIndices", () => {
  it("should return a list of indices that indicate the first occurrence of the duplicates", () => {
    const testArray = [
      { id: "xyz" },
      { id: "tuv" },
      { id: "abc" },
      { id: "xyz" },
      { id: "abc" },
    ];
    expect(findDuplicateIndices(testArray, "id")).toStrictEqual([0, 2]);
  });

  it("should return empty array if there are no duplicates", () => {
    const testArray = [
      { id: "abc" },
      { id: "def" },
      { id: "ghi" },
      { id: "tuv" },
      { id: "xyz" },
    ];
    expect(findDuplicateIndices(testArray, "id")).toStrictEqual([]);
  });
});
