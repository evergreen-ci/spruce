import { useState } from "react";
import debounce from "lodash.debounce";
import { useLocation, useHistory } from "react-router-dom";
import { FilterHookParams, FilterHookResult } from "hooks/useStatusesFilter";
import { url, queryString } from "utils";

const { parseQueryString } = queryString;
const { updateUrlQueryParam } = url;

const updateQueryParamWithDebounce = debounce(updateUrlQueryParam, 250);

/**
 * Filter input state management hook.
 * @param {FilterHookParams}
 * @return {FilterHookResult<string>}
 */
export const useFilterInputChangeHandler = ({
  urlParam,
  resetPage,
  sendAnalyticsEvent = () => undefined,
}: FilterHookParams): FilterHookResult<string> => {
  const { pathname, search } = useLocation();
  const { replace } = useHistory();

  const parsed = parseQueryString(search);
  const inputValue = (parsed[urlParam] || "").toString();

  const [value, setValue] = useState(inputValue);

  const setAndSubmitInputValue = (v: string): void => {
    setValue(v);
    sendAnalyticsEvent(urlParam);
    updateQueryParamWithDebounce(
      urlParam,
      v,
      search,
      replace,
      pathname,
      resetPage
    );
  };

  const submitInputValue = () => {
    updateUrlQueryParam(urlParam, value, search, replace, pathname, resetPage);
  };

  const reset = () => {
    setValue("");
    updateUrlQueryParam(urlParam, "", search, replace, pathname, resetPage);
  };

  return {
    inputValue: value,
    setAndSubmitInputValue,
    setInputValue: setValue,
    submitInputValue,
    reset,
  };
};
