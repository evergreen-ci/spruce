import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";
import { queryString } from "utils";

const { parseQueryString } = queryString;
/**
 * @param  {string} urlParam the param that will appear in the url search, e.g. `statuses`, `baseStatuses`
 * @param {boolean} page reset url page param to 0 if true
 * @param {boolean} resetPage update url page param to 0 if true
 * @return {[string[], (newValue: string[]) => void]}
 * pass first value in return array to `value` prop of dropdown component
 * pass second value in return array to `onChange` prop of dropdown component
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

  const hasDiff = !!(
    urlValue.length !== inputValue.length ||
    urlValue.filter((v) => !inputValue.includes(v)).length
  );

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
    hasDiff,
  };
};

interface UseStatusesFilterResult {
  inputValue: string[];
  setAndSubmitInputValue: (newValue: string[]) => void;
  setInputValue: (newValue: string[]) => void;
  submitInputValue: () => void;
  reset: () => void;
  hasDiff: boolean;
}
