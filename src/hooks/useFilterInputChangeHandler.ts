import { useState, useMemo } from "react";
import debounce from "lodash.debounce";
import { useLocation } from "react-router-dom";
import { FilterHookParams, FilterHookResult } from "hooks/useStatusesFilter";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";
import { queryString } from "utils";

const { parseQueryString } = queryString;

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
  const { search } = useLocation();
  const updateQueryParams = useUpdateURLQueryParams();
  const updateQueryParamWithDebounce = useMemo(
    () => debounce(updateQueryParams, 250),
    [updateQueryParams]
  );
  const { [urlParam]: rawValue } = parseQueryString(search);
  const urlValue = (rawValue || "").toString();

  const [inputValue, setInputValue] = useState(urlValue);

  const page = resetPage && { page: "0" };
  const updateUrl = (newValue: string) => {
    updateQueryParams({
      [urlParam]: newValue,
      ...page,
    });
  };

  const setAndSubmitInputValue = (newValue: string): void => {
    setInputValue(newValue);
    updateQueryParamWithDebounce({
      [urlParam]: newValue,
      ...page,
    });
    sendAnalyticsEvent(urlParam);
  };

  const submitInputValue = () => updateUrl(inputValue);

  const reset = () => {
    setInputValue("");
    updateUrl("");
    sendAnalyticsEvent(urlParam);
  };

  return {
    inputValue,
    setAndSubmitInputValue,
    setInputValue,
    submitInputValue,
    reset,
  };
};
