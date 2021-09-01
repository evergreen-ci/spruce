import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";
import { queryString } from "utils";

const { parseQueryString } = queryString;
/**
 * @param {string} urlParam the param that will appear in the url search, e.g. `statuses`, `baseStatuses`
 * @param {boolean} page reset url page param to 0 if true
 * @param {boolean} resetPage update url page param to 0 if true
 * @return {UseStatusesFilterResult} Provides status filter input state and state management util functions
 */
export const useStatusesFilter = (
  urlParam: string,
  resetPage?: boolean,
  sendAnalyticsEvent: (filterBy: string) => void = () => undefined
): UseStatusesFilterResult => {
  const { search } = useLocation();
  const updateQueryParams = useUpdateURLQueryParams();
  const { [urlParam]: rawStatuses } = parseQueryString(search);
  const urlValue = Array.isArray(rawStatuses)
    ? rawStatuses
    : [rawStatuses].filter((v) => v);

  const [inputValue, setInputValue] = useState(urlValue);

  const updateUrl = (newValue: string[]) =>
    updateQueryParams({
      [urlParam]: newValue,
      ...(resetPage && { page: "0" }),
    });

  const setAndSubmitInputValue = (newValue: string[]): void => {
    setInputValue(newValue);
    updateUrl(newValue);
    sendAnalyticsEvent(urlParam);
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
 * @typedef {Object} UseStatusesFilterResult
 * @property  {string[]} inputValue - Represents input value
 * @property  {(newValue: string[]) => void} setAndSubmitInputValue - Sets input value and updates URL query param
 * @property  {(newValue: string[]) => void} setInputValue - Sets input value
 * @property  {() => void} submitInputValue - Updates URL query param with current input value
 * @property  {() => void} reset - Clears input value and URL query param
 */

interface UseStatusesFilterResult {
  inputValue: string[];
  setAndSubmitInputValue: (newValue: string[]) => void;
  setInputValue: (newValue: string[]) => void;
  submitInputValue: () => void;
  reset: () => void;
}
