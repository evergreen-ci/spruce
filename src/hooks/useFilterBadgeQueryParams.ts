import { useLocation } from "react-router";
import { FilterBadgeType } from "components/FilterBadges/FilterBadge";
import { queryString, array } from "utils";
import { useUpdateURLQueryParams } from "./useUpdateURLQueryParams";

const { convertObjectToArray } = array;
const { parseQueryString } = queryString;

/**
 * useFilterBadgeQueryParams is used alongside the FilterBadges component to tie its state to query params
 */
const useFilterBadgeQueryParams = (validQueryParams: Set<string>) => {
  const updateQueryParams = useUpdateURLQueryParams();
  const location = useLocation();
  const { search } = location;
  const queryParams = parseQueryString(search);
  const queryParamsList = convertObjectToArray(queryParams).filter(({ key }) =>
    validQueryParams.has(key as string)
  );

  console.log(validQueryParams, queryParamsList);
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
