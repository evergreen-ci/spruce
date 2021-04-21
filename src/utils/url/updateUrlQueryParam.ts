import { queryString } from "utils";

const { parseQueryString, stringifyQuery } = queryString;

export const updateUrlQueryParam = (
  urlSearchParam: string,
  inputValue: string | string[] | null,
  search: string,
  replace: (path: string) => void,
  pathname: string,
  resetPage?: boolean
) => {
  const urlParams = parseQueryString(search);

  if (!inputValue) {
    delete urlParams[urlSearchParam];
  } else {
    urlParams[urlSearchParam] = inputValue;
  }

  const nextQueryParams = stringifyQuery({
    ...urlParams,
    ...(resetPage && { page: 0 }),
  });

  replace(`${pathname}?${nextQueryParams}`);
};
