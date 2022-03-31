import styled from "@emotion/styled";
import Button, { Variant, Size } from "@leafygreen-ui/button";
import { useLocation } from "react-router";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";
import { queryString, array } from "utils";
import { FilterBadge } from "./FilterBadge";
import { SeeMoreModal } from "./SeeMoreModal";

const { convertObjectToArray } = array;
const { parseQueryString } = queryString;

interface FilterBadgesProps {
  queryParamsToDisplay: Set<string>;
  onRemoveAnalytics?: () => void;
  onClearAllAnalytics?: () => void;
}
export const FilterBadges: React.FC<FilterBadgesProps> = ({
  queryParamsToDisplay,
  onRemoveAnalytics,
  onClearAllAnalytics,
}) => {
  const updateQueryParams = useUpdateURLQueryParams();
  const location = useLocation();
  const { search } = location;
  const queryParams = parseQueryString(search);
  const queryParamsList = convertObjectToArray(queryParams).filter(({ key }) =>
    queryParamsToDisplay.has(key as any)
  );

  const onRemove = (key: string, value: string) => {
    const updatedParam = popQueryParams(queryParams[key], value);
    if (onRemoveAnalytics) {
      onRemoveAnalytics();
    }
    updateQueryParams({ [key]: updatedParam });
  };

  const onClearAll = () => {
    // Need to manually set keys to undefined inorder to overwrite and clear queryParams
    const params = { ...queryParams };
    Object.keys(params).forEach((v) => {
      params[v] = undefined;
    });
    if (onClearAllAnalytics) {
      onClearAllAnalytics();
    }
    updateQueryParams(params);
  };
  const visibileQueryParams = queryParamsList.slice(0, 8);
  const notVisibleCount = queryParamsList.slice(8, queryParamsList.length)
    .length;
  return (
    <Container>
      {visibileQueryParams.map((p) => (
        <FilterBadge
          key={`filter_badge_${p.key}_${p.value}`}
          badge={p}
          onClose={() => onRemove(p.key, p.value)}
        />
      ))}
      {queryParamsList.length > 8 && (
        <SeeMoreModal
          badges={queryParamsList}
          notVisibleCount={notVisibleCount}
          onRemoveBadge={onRemove}
          onClearAll={onClearAll}
        />
      )}
      {queryParamsList.length > 0 && (
        <Button
          variant={Variant.Default}
          size={Size.XSmall}
          onClick={onClearAll}
          data-cy="clear-all-filters"
        >
          CLEAR ALL FILTERS
        </Button>
      )}
    </Container>
  );
};

const popQueryParams = (param: string | string[], value: string) => {
  if (Array.isArray(param)) {
    return param.filter((p) => p !== value);
  }
  return undefined;
};

const Container = styled.div`
  max-height: 72px; // height of 2 rows of @leafygreen-ui/badge elements
  overflow: hidden;
`;
