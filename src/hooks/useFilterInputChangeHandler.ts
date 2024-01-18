import { useState, useMemo, useEffect } from "react";
import debounce from "lodash.debounce";
import { useLocation } from "react-router-dom";
import { FilterHookParams, FilterHookResult } from "hooks/useStatusesFilter";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";
import { queryString } from "utils";

const { parseQueryString } = queryString;

/**
 * Filter input state management hook.
 * @param params - filter hook params
 * @param params.urlParam - the url param to update
 * @param params.resetPage - whether or not to reset the page to 0 when the input value changes
 * @param params.sendAnalyticsEvent - callback to send analytics event when input value changes
 * @returns - the filter input state and its state management functions
 */
export const useFilterInputChangeHandler = ({
  resetPage,
  sendAnalyticsEvent = () => undefined,
  urlParam,
}: FilterHookParams): FilterHookResult<string> => {
  const { search } = useLocation();
  const { [urlParam]: rawValue } = parseQueryString(search);
  const urlValue = (rawValue || "").toString();

  const updateQueryParams = useUpdateURLQueryParams();
  const updateQueryParamWithDebounce = useMemo(
    () => debounce(updateQueryParams, 250),
    [updateQueryParams],
  );

  const [inputValue, setInputValue] = useState(urlValue);
  const page = resetPage && { page: "0" };

  useEffect(() => {
    if (!urlValue && inputValue) {
      setInputValue("");
    } else if (inputValue !== urlValue) {
      setInputValue(urlValue);
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
