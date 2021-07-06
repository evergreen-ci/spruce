import React from "react";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { RadioGroup, Radio } from "@leafygreen-ui/radio-group";
import { Label } from "@leafygreen-ui/typography";
import { useLocation, useHistory } from "react-router-dom";
import { ChartToggleQueryParams, ChartTypes } from "types/commits";
import { queryString } from "utils";

const { gray } = uiColors;
const { stringifyQuery } = queryString;

export const ChartToggle: React.FC<{
  currentChartType: ChartTypes;
}> = ({ currentChartType }) => {
  const { pathname } = useLocation();
  const { replace } = useHistory();

  const onChangeChartType = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const nextChartType = event.target.value as ChartTypes;
    replace(
      `${pathname}?${stringifyQuery({
        [ChartToggleQueryParams.chartType]: nextChartType,
      })}`
    );
  };

  return (
    <Container>
      <ToggleWrapper>
        <Label htmlFor="chart-toggle">View Options</Label>
        <StyledRadioGroup
          size="default"
          onChange={onChangeChartType}
          value={currentChartType}
          name="chart-select"
        >
          <Radio
            data-cy="chart-absolute-radio"
            id="cy-chart-absolute-radio"
            value={ChartTypes.Absolute}
          >
            <Label htmlFor="chart-radio-absolute">Absolute Number</Label>
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
  padding-right: 4px;
  background: #ffffff;
  box-shadow: 0px 4px 10px -4px rgba(0, 0, 0, 0.3);
`;

const ToggleWrapper = styled.div`
  width: 286px;
`;
