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
  onRemove?: () => void;
  onClearAll?: () => void;
}
export const FilterBadges: React.VFC<FilterBadgesProps> = ({
  queryParamsToDisplay,
  onRemove = () => {},
  onClearAll = () => {},
}) => {
  const updateQueryParams = useUpdateURLQueryParams();
  const location = useLocation();
  const { search } = location;
  const queryParams = parseQueryString(search);
  const queryParamsList = convertObjectToArray(queryParams).filter(({ key }) =>
    queryParamsToDisplay.has(key as any)
  );

  const handleOnRemove = (key: string, value: string) => {
    const updatedParam = popQueryParams(queryParams[key], value);
    onRemove();
    updateQueryParams({ [key]: updatedParam });
  };

  const handleClearAll = () => {
    // Need to manually set keys to undefined inorder to overwrite and clear queryParams
    const params = { ...queryParams };
    Object.keys(params).forEach((v) => {
      params[v] = undefined;
    });
    onClearAll();
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
          onClose={() => {
            handleOnRemove(p.key, p.value);
          }}
        />
      ))}
      {queryParamsList.length > 8 && (
        <SeeMoreModal
          badges={queryParamsList}
          notVisibleCount={notVisibleCount}
          onRemoveBadge={handleOnRemove}
          onClearAll={handleClearAll}
        />
      )}
      {queryParamsList.length > 0 && (
        <Button
          variant={Variant.Default}
          size={Size.XSmall}
          onClick={handleClearAll}
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
