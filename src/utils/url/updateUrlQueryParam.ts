import { NavigateFunction } from "react-router-dom";
import { parseQueryString, stringifyQuery } from "utils/queryString";

export const updateUrlQueryParam = (
  urlSearchParam: string,
  inputValue: string | string[] | null,
  search: string,
  navigate: NavigateFunction,
  pathname: string,
  resetPage?: boolean,
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

  navigate(`${pathname}?${nextQueryParams}`, { replace: true });
};
