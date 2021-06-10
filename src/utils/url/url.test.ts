import { RECENT_PAGE_SIZE_KEY } from "constants/index";
import { getLimitFromSearch, upsertQueryParam } from ".";

describe("getLimitFromSearch", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should return the value of the 'limit' query variable from the given search string if it is a valid page size.", () => {
    expect(getLimitFromSearch("&limit=10")).toEqual(10);
    expect(getLimitFromSearch("&limit=20")).toEqual(20);
    expect(getLimitFromSearch("&limit=50")).toEqual(50);
    expect(getLimitFromSearch("&limit=100")).toEqual(100);
  });

  it("should return the recent page size value in local storage when the value in local storage is a valid page size and the given search string does not contain a valid limit,", () => {
    localStorage.setItem(RECENT_PAGE_SIZE_KEY, "50");
    expect(getLimitFromSearch("&limit=11")).toEqual(50);
    expect(getLimitFromSearch("&limit")).toEqual(50);
    expect(getLimitFromSearch("&limit=0")).toEqual(50);
    expect(getLimitFromSearch("")).toEqual(50);
  });
});

describe("upsertQueryParam", () => {
  describe("should return the value when params aren't passed in", () => {
    expect(upsertQueryParam(undefined, "test")).toEqual(["test"]);
    expect(upsertQueryParam(undefined, "something")).toEqual(["something"]);
  });
  describe("when there is a single value as a param", () => {
    it("should not add a duplicate value", () => {
      expect(upsertQueryParam("test", "test")).toEqual(["test"]);
    });
    it("should add a new value", () => {
      expect(upsertQueryParam("test", "something")).toEqual([
        "test",
        "something",
      ]);
    });
  });
  describe("when there is a array value as a param", () => {
    it("should not add a duplicate value", () => {
      expect(upsertQueryParam(["test", "something"], "test")).toEqual([
        "test",
        "something",
      ]);
    });
    it("should add a new value", () => {
      expect(upsertQueryParam(["test", "something"], "else")).toEqual([
        "test",
        "something",
        "else",
      ]);
    });
  });
});
