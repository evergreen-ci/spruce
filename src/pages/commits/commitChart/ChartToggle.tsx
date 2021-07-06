import React from "react";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { RadioGroup, Radio } from "@leafygreen-ui/radio-group";
import { Label } from "@leafygreen-ui/typography";
import { useParams, useLocation, useHistory } from "react-router-dom";
import { routes, getCommitRoute } from "constants/routes";
import { useUpdateURLQueryParams } from "hooks/useUpdateURLQueryParams";
import { ChartTypes } from "pages/commits/CommitsWrapper";
import { queryString } from "utils";

const { gray } = uiColors;
const { parseQueryString, stringifyQuery } = queryString;

export enum QueryParams {
  chartType = "chartType",
}

export const ChartToggle: React.FC<{
  currentChartType: ChartTypes;
}> = ({ currentChartType }) => {
  let currChartType = currentChartType;
  const { pathname } = useLocation();
  const { projectId } = useParams<{ projectId: string }>();
  const { replace } = useHistory();
  const updateQueryParams = useUpdateURLQueryParams();
  const onChangeChartType = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const nextChartType = event.target.value as ChartTypes;
    replace(`${getCommitRoute(projectId)}/${nextChartType}`);
    currChartType = nextChartType;
  };
  return (
    <Container>
      <ToggleWrapper>
        <Label htmlFor="chart-toggle">View Options</Label>
        <StyledRadioGroup
          size="default"
          onChange={onChangeChartType}
          value={currChartType}
          name="chart-select"
        >
          <Radio
            data-cy="chart-abs-radio"
            id="cy-chart-abs-radio"
            value={ChartTypes.Absolute}
          >
            <Label htmlFor="chart-radio-abs">Absolute Number</Label>
          </Radio>
          <Radio
            data-cy="chart-percent-radio"
            id="cy-chart-percent-radio"
            value={ChartTypes.Percentage}
          >
            <Label htmlFor="chart-radio-percent">Percentage</Label>
          </Radio>
        </StyledRadioGroup>
      </ToggleWrapper>
    </Container>
  );
};

const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

// @ts-expect-error
const StyledRadioGroup = styled(RadioGroup)`
  display: flex;
  align-items: center;
  white-space: nowrap;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  width: 286px;
  height: 59px;
  border-radius: 7px;
  border: 1px solid ${gray.light2};
  margin-top: 4px;
  padding-bottom: 6px;
  padding-right: 3px;
  background: #ffffff;
  box-shadow: 0px 4px 10px -4px rgba(0, 0, 0, 0.3);
`;

const ToggleWrapper = styled.div`
  width: 286px;
`;
