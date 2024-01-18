import { useLocation } from "react-router-dom";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";
import { queryString, array } from "utils";
import { FilterBadgeType } from "./FilterBadge";

const { convertObjectToArray } = array;
const { parseQueryString } = queryString;

/**
 * useFilterBadgeQueryParams is used alongside the FilterBadges component to tie its state to query params
 * @param validQueryParams - a set of valid query params that the FilterBadges component can use
 * @returns - an object with the following properties:
 * `queryParamsList` - a list of badges that are currently in the query params
 * `handleClearAll` - a function that clears all badges from the query params
 * `handleOnRemove` - a function that removes a badge from the query params
 */
const useFilterBadgeQueryParams = (validQueryParams: Set<string>) => {
  const updateQueryParams = useUpdateURLQueryParams();
  const location = useLocation();
  const { search } = location;
  const queryParams = parseQueryString(search);
  const queryParamsList = convertObjectToArray(queryParams).filter(({ key }) =>
    validQueryParams.has(key as string),
  );

  const handleClearAll = () => {
    const params = { ...queryParams };
    Object.keys(params)
      .filter((badge) => validQueryParams.has(badge))
      .forEach((v) => {
        params[v] = undefined;
      });
    updateQueryParams(params);
  };
  const handleOnRemove = (badge: FilterBadgeType) => {
    const updatedParam = popQueryParams(queryParams[badge.key], badge.value);
    updateQueryParams({ [badge.key]: updatedParam });
  };

  return {
    badges: queryParamsList,
    handleClearAll,
    handleOnRemove,
  };
};

const popQueryParams = (param: string | string[], value: string) => {
  if (Array.isArray(param)) {
    return param.filter((p) => p !== value);
  }
  return undefined;
};

export default useFilterBadgeQueryParams;
