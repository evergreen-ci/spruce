import "jest-localstorage-mock";
import { getLimitFromSearch } from "utils/url";
import { RECENT_PAGE_SIZE_KEY } from "components/PageSizeSelector";

beforeEach(() => {
  localStorage.clear();
});

test("getLimitFromSearch should return the value of the 'limit' query variable from the given search string if it is a valid page size.", () => {
  expect(getLimitFromSearch("&limit=10")).toEqual(10);
  expect(getLimitFromSearch("&limit=20")).toEqual(20);
  expect(getLimitFromSearch("&limit=50")).toEqual(50);
  expect(getLimitFromSearch("&limit=100")).toEqual(100);
});

test("getLimitFromSearch should return the recent page size value in local storage when the value in local storage is a valid page size and the given search string does not contain a valid limit,", () => {
  localStorage.setItem(RECENT_PAGE_SIZE_KEY, "50");
  expect(getLimitFromSearch("&limit=11")).toEqual(50);
  expect(getLimitFromSearch("&limit")).toEqual(50);
  expect(getLimitFromSearch("&limit=0")).toEqual(50);
  expect(getLimitFromSearch("")).toEqual(50);
});
