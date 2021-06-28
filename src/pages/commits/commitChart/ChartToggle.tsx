import React from "react";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { RadioGroup, Radio } from "@leafygreen-ui/radio-group";
import { Label } from "@leafygreen-ui/typography";

const { gray } = uiColors;

export enum ChartTypes {
  Absolute = "Absolute",
  Percentage = "Percentage",
}

export const ChartToggle: React.FC = () => (
  <Container>
    <ToggleWrapper>
      <Label htmlFor="chart-toggle">View Options</Label>
      <ToggleBox>
        <RadioGroup onChange={(event) => console.log(event)}>
          <Radio
            data-cy="chart-radio"
            id="cy-chart-radio"
            value={ChartTypes.Absolute}
          >
            <Label htmlFor="chart-radio-abs">Absolute Number</Label>
          </Radio>
          <Radio
            data-cy="chart-radio"
            id="cy-chart-radio"
            value={ChartTypes.Percentage}
          >
            <Label htmlFor="chart-radio-percent">Percentage</Label>
          </Radio>
        </RadioGroup>
      </ToggleBox>
    </ToggleWrapper>
  </Container>
);

const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;
const ToggleBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  width: 286px;
  height: 59px;
  border-radius: 7px;
  border: 1px solid ${gray.light2};
  background: #ffffff;
  margin-top: 4px;
  padding-bottom: 6px;
  box-shadow: 0px 4px 10px -4px rgba(0, 0, 0, 0.3);
`;
const ToggleWrapper = styled.div`
  width: 286px;
`;
