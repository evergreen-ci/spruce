import { useState } from "react";
import debounce from "lodash.debounce";
import { useLocation, useHistory } from "react-router-dom";
import { FilterHookParams } from "hooks/useStatusesFilter";
import { url, queryString } from "utils";

const { parseQueryString } = queryString;
const { updateUrlQueryParam } = url;

const updateQueryParamWithDebounce = debounce(updateUrlQueryParam, 250);

type InputEvent = React.ChangeEvent<HTMLInputElement>;

/**
 * Filter input state management hook.
 * @param {FilterHookParams}
 * @return {FilterHookResult<string>}
 */
export const useFilterInputChangeHandler = ({
  urlParam,
  resetPage,
  sendAnalyticsEvent = () => undefined,
}: FilterHookParams): [string, (e: InputEvent) => void] => {
  const { pathname, search } = useLocation();
  const { replace } = useHistory();

  const parsed = parseQueryString(search);
  const inputValue = (parsed[urlParam] || "").toString();

  const [value, setValue] = useState(inputValue);

  const onChange = (e: InputEvent): void => {
    setValue(e.target.value);

    sendAnalyticsEvent(urlParam);

    updateQueryParamWithDebounce(
      urlParam,
      e.target.value,
      search,
      replace,
      pathname,
      resetPage
    );
  };

  return [value, onChange];
};
