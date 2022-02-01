import React from "react";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { RadioGroup, Radio } from "@leafygreen-ui/radio-group";
import { Label } from "@leafygreen-ui/typography";
import { size } from "constants/tokens";
import { ChartTypes } from "types/commits";

const { gray } = uiColors;

export const ChartToggle: React.FC<{
  currentChartType: ChartTypes;
  onChangeChartType: (chartType: ChartTypes) => void;
}> = ({ currentChartType, onChangeChartType }) => {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const chartType = e.target.value as ChartTypes;
    onChangeChartType(chartType);
  };
  return (
    <Container>
      <ToggleWrapper>
        <Label htmlFor="chart-toggle">View Options</Label>
        <StyledRadioGroup
          size="default"
          onChange={onChange}
          value={currentChartType}
          name="chart-select"
        >
          <Radio
            data-cy="cy-chart-absolute-radio"
            id="chart-radio-absolute"
            value={ChartTypes.Absolute}
          >
            <Label htmlFor="chart-radio-absolute">Absolute Number</Label>
          </Radio>
          <Radio
            data-cy="cy-chart-percent-radio"
            id="chart-radio-percent"
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
  z-index: 3;
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
  margin-top: ${size.xxs};
  padding-bottom: 6px;
  padding-right: ${size.xxs};
  background: #ffffff;
  box-shadow: 0px ${size.xxs} 10px -${size.xxs} rgba(0, 0, 0, 0.3);
`;

const ToggleWrapper = styled.div`
  width: 286px;
`;
