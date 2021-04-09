import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import Button, { Variant, Size } from "@leafygreen-ui/button";
import { uiColors } from "@leafygreen-ui/palette";
import { useLocation } from "react-router";
import Icon from "components/icons/Icon";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";
import { parseQueryString } from "utils";

const { gray } = uiColors;
export const FilterBadges: React.FC = () => {
  const updateQueryParams = useUpdateURLQueryParams();
  const location = useLocation();
  const { search } = location;
  const queryParams = parseQueryString(search);
  const queryParamsList = arrayifyQueryParams(queryParams);
  const onRemove = (key: string, value: string) => () => {
    const updatedParam = popQueryParams(queryParams[key], value);
    updateQueryParams({ [key]: updatedParam });
  };

  const onClearAllClick = () => {
    // We want to clear our query params
    const params = { ...queryParams };
    Object.keys(params).forEach((v) => {
      params[v] = undefined;
    });

    updateQueryParams(params);
  };
  return (
    <div style={{ overflowX: "scroll" }}>
      {queryParamsList.map((p) => (
        <PaddedBadge key={`filter_badge_${p.key}_${p.value}`}>
          <BadgeContent>
            <TextWrapper>
              {p.key} : {p.value}
            </TextWrapper>
            <ClickableIcon glyph="X" onClick={onRemove(p.key, p.value)} />
          </BadgeContent>
        </PaddedBadge>
      ))}
      {queryParamsList.length > 0 && (
        <Button
          variant={Variant.Default}
          size={Size.XSmall}
          onClick={onClearAllClick}
        >
          CLEAR ALL FILTERS
        </Button>
      )}
    </div>
  );
};

const popQueryParams = (param: string | string[], value: string) => {
  if (Array.isArray(param)) {
    const index = param.indexOf(value);
    if (index > -1) {
      param.splice(index, 1);
    }
    return param;
  }
  return undefined;
};
const arrayifyQueryParams = (params) => {
  const result = [];
  if (params === undefined) return result;
  const queryParamsList = Object.keys(params);
  queryParamsList.forEach((key) => {
    const value = params[key];
    if (!Array.isArray(value)) {
      result.push({ key, value });
      return;
    }
    value.forEach((v) => {
      result.push({ key, value: v });
    });
  });
  return result;
};
const ClickableIcon = styled(Icon)`
  position: absolute;
  right: 2%;
  :hover {
    cursor: pointer;

    color: ${gray.light1};
  }
`;
const PaddedBadge = styled(Badge)`
  :nth-of-type {
    margin-left: 16px;
  }
  margin-right: 16px;
  margin-bottom: 21px;
  width: 260px;
`;

const BadgeContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  position: relative;
`;

const TextWrapper = styled.div``;
