import { useState, useEffect } from "react";
import debounce from "lodash.debounce";
import { useLocation, useHistory } from "react-router-dom";
import { url, queryString } from "utils";

const { parseQueryString } = queryString;
const { updateUrlQueryParam } = url;

const updateQueryParamWithDebounce = debounce(updateUrlQueryParam, 250);

type InputEvent = React.ChangeEvent<HTMLInputElement>;

/**
 * useFilterInputChangeHandler updates the url query param (urlSearchParam) by the
 * the value user enters into the input field.
 * @param  {string} urlSearchParam the url search param that should update
 * @param {boolean} resetPage update url page param to 0 if true
 * @param {(filterBy: string) => void} sendAnalyticsEvent analytics event that is dispatched on filter change
 * @return {[string, (e: InputEvent) => void]}
 */
export const useFilterInputChangeHandler = (
  urlSearchParam: string,
  resetPage: boolean,
  sendAnalyticsEvent: (filterBy: string) => void = () => undefined
): [
  string,
  (e: InputEvent) => void,
  (e: InputEvent) => void,
  () => void,
  () => void
] => {
  const { pathname, search } = useLocation();
  const { replace } = useHistory();

  const parsed = parseQueryString(search);
  const inputValue = (parsed[urlSearchParam] || "").toString();

  const [value, setValue] = useState(inputValue);

  useEffect(() => {
    setValue(inputValue);
  }, [inputValue]);

  const updateAndSubmitWithDebounce = (e: InputEvent): void => {
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

  const updateOnly = (e: InputEvent): void => {
    setValue(e.target.value);
  };

  const submitOnly = () => {
    updateUrlQueryParam(
      urlSearchParam,
      value,
      search,
      replace,
      pathname,
      resetPage
    );
  };

  const reset = (): void => {
    setValue("");
    updateUrlQueryParam(
      urlSearchParam,
      "",
      search,
      replace,
      pathname,
      resetPage
    );
  };

  return [value, updateAndSubmitWithDebounce, updateOnly, submitOnly, reset];
};
