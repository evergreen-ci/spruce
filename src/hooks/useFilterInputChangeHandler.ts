import { useState, useEffect } from "react";
import debounce from "lodash.debounce";
import { useLocation, useHistory } from "react-router-dom";
import { parseQueryString } from "utils/queryString/parseQueryString";
import { updateUrlQueryParam } from "utils/url";

const updateQueryParamWithDebounce = debounce(updateUrlQueryParam, 250);

type InputEvent = React.ChangeEvent<HTMLInputElement>;

/**
 * useFilterInputChangeHandler updates the url query param (urlSearchParam) by the
 * the value user enters into the input field.
 * @param  {string} urlSearchParam the url search param that should update
 * @param  {string} pathname url pathname
 * @param  {string} search url search
 * @param  {(path:string)=>void} replace method from react router to update ur
 * @param {boolean} resetPage update url page param to 0 if true
 * @return {[string, (e: InputEvent) => void]}
 * pass {string} return value to input component as `value`
 * pass {(e: InputEvent) => void} return value to input component as onChange prop
 */
export const useFilterInputChangeHandler = (
  urlSearchParam: string,
  resetPage?: boolean,
  sendAnalyticsEvent: (filterBy: string) => void = () => undefined
): [string, (e: InputEvent) => void] => {
  const { pathname, search } = useLocation();
  const { replace } = useHistory();

  const parsed = parseQueryString(search);
  const inputValue = (parsed[urlSearchParam] || "").toString();

  const [value, setValue] = useState(inputValue);

  useEffect(() => {
    setValue(inputValue);
  }, [inputValue]);

  const onChange = (e: InputEvent): void => {
    setValue(e.target.value);

    sendAnalyticsEvent(urlSearchParam);

    updateQueryParamWithDebounce(
      urlSearchParam,
      e.target.value,
      search,
      replace,
      pathname,
      resetPage
    );
  };

  return [value, onChange];
};
