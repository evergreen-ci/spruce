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

type InputEvent = React.ChangeEvent<HTMLInputElement>;

/**
 * useFilterInputChangeHandler updates the url query param (urlSearchParam) by the
 * the value user enters into the input field.
 * @param  {string} urlSearchParam the url search param that should update
 * @param  {string} pathname url pathname
 * @param  {string} search url search
 * @param  {(path:string)=>void} replace method from react router to update ur
 * @return {[string, (e: InputEvent) => void]}
 * pass {string} return value to input component as `value`
 * pass {(e: InputEvent) => void} return value to input component as onChange prop
 */
export const useFilterInputChangeHandler = (
  urlSearchParam: string,
  pathname: string,
  search: string,
  replace: (path: string) => void
): [string, (e: InputEvent) => void] => {
  const parsed = queryString.parse(search, { arrayFormat: "comma" });
  const inputValue = (parsed[urlSearchParam] || "").toString();
  const [value, setValue] = useState(inputValue);

  const onChange = (e: InputEvent): void => {
    setValue(e.target.value);
    updateQueryParam(urlSearchParam, e.target.value, search, replace, pathname);
  };
  return [value, onChange];
};
