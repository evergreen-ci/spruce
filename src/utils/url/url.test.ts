import { RECENT_PAGE_SIZE_KEY } from "constants/index";
import { getLimitFromSearch, upsertQueryParam } from ".";

describe("getLimitFromSearch", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should return the value of the 'limit' query variable from the given search string if it is a valid page size.", () => {
    expect(getLimitFromSearch("&limit=10")).toBe(10);
    expect(getLimitFromSearch("&limit=20")).toBe(20);
    expect(getLimitFromSearch("&limit=50")).toBe(50);
    expect(getLimitFromSearch("&limit=100")).toBe(100);
  });

  it("should return the recent page size value in local storage when the value in local storage is a valid page size and the given search string does not contain a valid limit,", () => {
    localStorage.setItem(RECENT_PAGE_SIZE_KEY, "50");
    expect(getLimitFromSearch("&limit=11")).toBe(50);
    expect(getLimitFromSearch("&limit")).toBe(50);
    expect(getLimitFromSearch("&limit=0")).toBe(50);
    expect(getLimitFromSearch("")).toBe(50);
  });
});

describe("upsertQueryParam", () => {
  it("should return the value when params aren't passed in", () => {
    expect(upsertQueryParam(undefined, "test")).toStrictEqual(["test"]);
    expect(upsertQueryParam(undefined, "something")).toStrictEqual([
      "something",
    ]);
  });
  describe("when there is a single value as a param", () => {
    it("should not add a duplicate value", () => {
      expect(upsertQueryParam("test", "test")).toStrictEqual(["test"]);
    });
    it("should add a new value", () => {
      expect(upsertQueryParam("test", "something")).toStrictEqual([
        "test",
        "something",
      ]);
    });
  });
  describe("when there is a array value as a param", () => {
    it("should not add a duplicate value", () => {
      expect(upsertQueryParam(["test", "something"], "test")).toStrictEqual([
        "test",
        "something",
      ]);
    });
    it("should add a new value", () => {
      expect(upsertQueryParam(["test", "something"], "else")).toStrictEqual([
        "test",
        "something",
        "else",
      ]);
    });
  });
});
