import { ClassNames } from "@emotion/react";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { RadioGroup, Radio } from "@leafygreen-ui/radio-group";
import { Label } from "@leafygreen-ui/typography";
import { useProjectHealthAnalytics } from "analytics/projectHealth/useProjectHealthAnalytics";
import { size } from "constants/tokens";
import { ChartTypes } from "types/commits";

const { gray } = uiColors;

export const ChartToggle: React.FC<{
  currentChartType: ChartTypes;
  onChangeChartType: (chartType: ChartTypes) => void;
}> = ({ currentChartType, onChangeChartType }) => {
  const { sendEvent } = useProjectHealthAnalytics();
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const chartType = e.target.value as ChartTypes;
    onChangeChartType(chartType);
    sendEvent({ name: "Click view option", viewOption: chartType });
  };
  return (
    <ClassNames>
      {({ css }) => (
        <ToggleWrapper>
          <Label htmlFor="chart-toggle">View Options</Label>
          <StyledRadioGroup
            size="default"
            onChange={onChange}
            value={currentChartType}
            name="chart-select"
            className={css`
              font-weight: bold;
            `}
          >
            <Radio
              data-cy="cy-chart-absolute-radio"
              id="chart-radio-absolute"
              value={ChartTypes.Absolute}
            >
              Absolute Number
            </Radio>
            <Radio
              data-cy="cy-chart-percent-radio"
              id="chart-radio-percent"
              value={ChartTypes.Percentage}
              className={css`
                font-weight: bold;
              `}
            >
              Percentage
            </Radio>
          </StyledRadioGroup>
        </ToggleWrapper>
      )}
    </ClassNames>
  );
};

// @ts-expect-error
const StyledRadioGroup = styled(RadioGroup)`
  display: flex;
  align-items: center;
  white-space: nowrap;
  justify-content: space-evenly;
  width: 286px;
  border-radius: 7px;
  border: 1px solid ${gray.light2};
  padding: ${size.xs} 0 ${size.s} 0;
  background: #ffffff;
  box-shadow: 0px ${size.xxs} 10px -${size.xxs} rgba(0, 0, 0, 0.3);
`;

const ToggleWrapper = styled.div`
  width: 286px;
`;
