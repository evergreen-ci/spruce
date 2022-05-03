import { useState, useMemo, useEffect } from "react";
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
  const { [urlParam]: rawValue } = parseQueryString(search);
  const urlValue = (rawValue || "").toString();

  const updateQueryParams = useUpdateURLQueryParams();
  const updateQueryParamWithDebounce = useMemo(
    () => debounce(updateQueryParams, 250),
    [updateQueryParams]
  );

  const [inputValue, setInputValue] = useState(urlValue);
  const page = resetPage && { page: "0" };

  useEffect(() => {
    if (!urlValue && inputValue) {
      setInputValue("");
    }
  }, [urlValue]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateUrl = (newValue: string) => {
    updateQueryParams({
      [urlParam]: newValue || undefined,
      ...page,
    });
  };

  const setAndSubmitInputValue = (newValue: string): void => {
    setInputValue(newValue);
    updateQueryParamWithDebounce({
      [urlParam]: newValue || undefined,
      ...page,
    });
    sendAnalyticsEvent(urlParam);
  };

  const submitInputValue = () => {
    updateUrl(inputValue);
    sendAnalyticsEvent(urlParam);
  };

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
