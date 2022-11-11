import { ClassNames } from "@emotion/react";
import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { RadioGroup, Radio } from "@leafygreen-ui/radio-group";
import { useProjectHealthAnalytics } from "analytics/projectHealth/useProjectHealthAnalytics";
import { Accordion } from "components/Accordion";
import { size } from "constants/tokens";
import { ChartTypes } from "types/commits";

const { gray } = palette;

export const ChartToggle: React.VFC<{
  onToggleAccordion: (nextState: { isVisible: boolean }) => void;
  defaultOpenAccordion: boolean;
  currentChartType: ChartTypes;
  onChangeChartType: (chartType: ChartTypes) => void;
}> = ({
  currentChartType,
  onChangeChartType,
  defaultOpenAccordion,
  onToggleAccordion,
}) => {
  const { sendEvent } = useProjectHealthAnalytics({ page: "Commit chart" });
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const chartType = e.target.value as ChartTypes;
    onChangeChartType(chartType);
    sendEvent({
      name: "Select chart view option",
      viewOption: chartType,
    });
  };
  return (
    <AccordionContainer>
      <Accordion
        title="View options"
        defaultOpen={defaultOpenAccordion}
        onToggle={onToggleAccordion}
      >
        <ClassNames>
          {({ css }) => (
            <ToggleWrapper>
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
                  className={css`
                    margin: ${size.xs} 0;
                  `}
                >
                  Absolute Number
                </Radio>
                <Radio
                  data-cy="cy-chart-percent-radio"
                  id="chart-radio-percent"
                  value={ChartTypes.Percentage}
                  className={css`
                    margin-bottom: ${size.xs};
                  `}
                >
                  Percentage
                </Radio>
              </StyledRadioGroup>
            </ToggleWrapper>
          )}
        </ClassNames>
      </Accordion>
    </AccordionContainer>
  );
};

const StyledRadioGroup = styled(RadioGroup)`
  display: flex;
  align-items: center;
  gap: ${size.xs};
  font-weight: bold;
  white-space: nowrap;
`;

const ToggleWrapper = styled.div`
  padding: ${size.xxs} ${size.xs};
  border-radius: ${size.xs};
  border: 1px solid ${gray.light2};
  background: #ffffff;
  box-shadow: 0px ${size.xxs} ${size.xs} -${size.xxs} rgba(0, 0, 0, 0.3);
`;

const AccordionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;
