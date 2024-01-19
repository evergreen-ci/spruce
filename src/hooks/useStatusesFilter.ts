import { useEffect, useState, useMemo } from "react";
import isEqual from "lodash.isequal";
import { useLocation } from "react-router-dom";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";
import { queryString } from "utils";

const { parseQueryString } = queryString;
/**
 * Status filter state management hook.
 * @param props - filter hook params
 * @param props.urlParam - the url param to update
 * @param props.resetPage - whether or not to reset the page to 0 when the input value changes
 * @param props.sendAnalyticsEvent - callback to send analytics event when input value changes
 * @returns - the status filter state and its state management functions
 */
export const useStatusesFilter = ({
  resetPage,
  sendAnalyticsEvent = () => undefined,
  urlParam,
}: FilterHookParams): FilterHookResult<string[]> => {
  const { search } = useLocation();
  const updateQueryParams = useUpdateURLQueryParams();
  const { [urlParam]: rawStatuses } = parseQueryString(search);
  const urlValue = useMemo(
    () =>
      Array.isArray(rawStatuses) ? rawStatuses : [rawStatuses].filter((v) => v),
    [rawStatuses],
  );

  const [inputValue, setInputValue] = useState(urlValue);

  useEffect(() => {
    if (!urlValue.length && inputValue.length) {
      setInputValue([]);
    } else if (!isEqual(urlValue, inputValue)) {
      setInputValue(urlValue);
    }
  }, [urlValue]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateUrl = (newValue: string[]) =>
    updateQueryParams({
      [urlParam]: newValue,
      ...(resetPage && { page: "0" }),
    });

  const setAndSubmitInputValue = (newValue: string[]): void => {
    setInputValue(newValue);
    updateUrl(newValue);
    sendAnalyticsEvent(urlParam, newValue);
  };

  const submitInputValue = () => updateUrl(inputValue);

  const reset = () => setAndSubmitInputValue([]);

  return {
    inputValue,
    setAndSubmitInputValue,
    setInputValue,
    submitInputValue,
    reset,
  };
};

/**
 * FilterHookResult - Provides filter input state and state management util functions
 * inputValue - Represents input value
 * setAndSubmitInputValue - Sets input value and updates URL query param
 * setInputValue - Sets input value
 * submitInputValue - Updates URL query param with current input value
 * reset - Clears input value and URL query param
 */
export interface FilterHookResult<T> {
  inputValue: T;
  setAndSubmitInputValue: (newValue: T) => void;
  setInputValue: (newValue: T) => void;
  submitInputValue: () => void;
  reset: () => void;
}

/**
 * urlParam - Represents URL query param name
 * resetPage - When true, page URL query paramter is set to 0 upon value submission
 * sendAnalyticsEvent - A side effect executed upon value submission
 */
export interface FilterHookParams {
  urlParam: string;
  resetPage?: boolean;
  sendAnalyticsEvent?: (filterBy: string, filterValue?: string[]) => void;
}
