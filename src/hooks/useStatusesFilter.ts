import { useEffect, useState, useMemo } from "react";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";
import { useLocation } from "react-router-dom";
import { queryString } from "utils";

const { parseQueryString } = queryString;
/**
 * Status filter state management hook.
 * @param {FilterHookParams}
 * @return {FilterHookResult<string[]>}
 */
export const useStatusesFilter = ({
  urlParam,
  resetPage,
  sendAnalyticsEvent = () => undefined,
}: FilterHookParams): FilterHookResult<string[]> => {
  const { search } = useLocation();
  const updateQueryParams = useUpdateURLQueryParams();
  const { [urlParam]: rawStatuses } = parseQueryString(search);
  const urlValue = useMemo(
    () =>
      Array.isArray(rawStatuses) ? rawStatuses : [rawStatuses].filter((v) => v),
    [rawStatuses]
  );

  const [inputValue, setInputValue] = useState(urlValue);

  useEffect(() => {
    if (!urlValue.length && inputValue.length) {
      setInputValue([]);
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
 * @typedef   {Object} FilterHookResult - Provides filter input state and state management util functions
 * @template  {T}
 * @property  {T} inputValue - Represents input value
 * @property  {(newValue: T) => void} setAndSubmitInputValue - Sets input value and updates URL query param
 * @property  {(newValue: T) => void} setInputValue - Sets input value
 * @property  {() => void} submitInputValue - Updates URL query param with current input value
 * @property  {() => void} reset - Clears input value and URL query param
 */
export interface FilterHookResult<T> {
  inputValue: T;
  setAndSubmitInputValue: (newValue: T) => void;
  setInputValue: (newValue: T) => void;
  submitInputValue: () => void;
  reset: () => void;
}

/**
 * @typedef {Object} FilterHookParams
 * @property {string} urlParam Represents URL query param name
 * @property {boolean} [resetPage] When true, page URL query paramter is set to 0 upon value submission
 * @property {(filterBy: string, filterValue?: string[]) => void} [sendAnalyticsEvent] A side effect executed upon value submission
 */
export interface FilterHookParams {
  urlParam: string;
  resetPage?: boolean;
  sendAnalyticsEvent?: (filterBy: string, filterValue?: string[]) => void;
}
