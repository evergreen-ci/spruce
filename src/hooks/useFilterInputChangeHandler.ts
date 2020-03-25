import { useState } from "react";
import debounce from "lodash.debounce";
import queryString from "query-string";

const updateQueryParam = debounce(
  (
    urlSearchParam: string,
    inputValue: string,
    search: string,
    replace: (path: string) => void,
    pathname: string
  ) => {
    const nextQueryParams = queryString.stringify({
      ...queryString.parse(search, { arrayFormat }),
      [urlSearchParam]: inputValue === "" ? undefined : inputValue
    });
    replace(`${pathname}?${nextQueryParams}`);
  },
  250
);

const arrayFormat = "comma";

type InputEvent = React.ChangeEvent<HTMLInputElement>;

export const useFilterInputChangeHandler = (
  urlSearchParam: string,
  pathname: string,
  search: string,
  replace: (path: string) => void
): [string, (e: InputEvent) => void] => {
  const parsed = queryString.parse(search, { arrayFormat });
  const inputValue = (parsed[urlSearchParam] || "").toString();

  const [value, setValue] = useState(inputValue);

  const onChange = (e: InputEvent): void => {
    setValue(e.target.value);
    updateQueryParam(urlSearchParam, e.target.value, search, replace, pathname);
  };

  return [value, onChange];
};
