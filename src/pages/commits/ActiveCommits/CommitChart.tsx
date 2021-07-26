import React from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import Tooltip from "@leafygreen-ui/tooltip";
import { Disclaimer } from "@leafygreen-ui/typography";
import { mapColorToTaskUmbrellaStatusCopy } from "constants/task";
import { ChartTypes } from "types/commits";
import {
  ColorCount,
  getZeroCountStatusColors,
  calculateBarHeight,
} from "./utils";

const { gray } = uiColors;
interface Props {
  groupedTaskStats: ColorCount[];
  max: number;
  total: number;
  chartType: ChartTypes;
}

export const CommitChart: React.FC<Props> = ({
  max,
  chartType,
  groupedTaskStats,
  total,
}) => {
  const zeroCountStatusColors = getZeroCountStatusColors(groupedTaskStats);
  return (
    <Tooltip
      usePortal={false}
      align="right"
      justify="middle"
      popoverZIndex={1}
      trigger={
        <ChartContainer data-cy="commit-chart-container">
          {groupedTaskStats.map(({ color, count }) => (
            <Bar
              data-cy="commit-chart-bar"
              key={color}
              height={calculateBarHeight(count, max, total, chartType)}
              color={color}
            />
          ))}
        </ChartContainer>
      }
      triggerEvent="hover"
    >
      <TooltipContainer data-cy="commit-chart-tooltip">
        {groupedTaskStats.map(({ color, count, statuses }) => (
          <FlexColumnContainer>
            <TotalCountContainer
              css={sharedFontCss}
              data-cy="current-statuses-count"
              key={color}
            >
              <Circle color={color} />
              <Status
                css={sharedFontCss}
              >{`Total ${mapColorToTaskUmbrellaStatusCopy[color]}`}</Status>
              <Number css={sharedFontCss}>{count}</Number>
            </TotalCountContainer>
            <Substatus css={sharedFontCss}>{`(${statuses.join(
              ", "
            )})`}</Substatus>
          </FlexColumnContainer>
        ))}
        {zeroCountStatusColors.map((color) => (
          <TotalCountContainer
            css={sharedFontCss}
            opacity={0.4}
            data-cy="missing-statuses-count"
            key={color}
          >
            <Circle color={color} />
            <Status
              css={sharedFontCss}
            >{`Total ${mapColorToTaskUmbrellaStatusCopy[color]}`}</Status>
            <Number css={sharedFontCss}>0</Number>
          </TotalCountContainer>
        ))}
      </TooltipContainer>
    </Tooltip>
  );
};

const ChartContainer = styled.div`
  height: 224px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
`;

interface BarProps {
  height: string;
  color: string;
}

const Bar = styled.div<BarProps>`
  height: ${({ height }) => height};
  background-color: ${({ color }) => color};
  width: 13px;
`;

const TooltipContainer = styled.div`
  margin: auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-direction: column;
  background-color: ${gray.light3};
`;

const Number = styled(Disclaimer)`
  width: 40px;
  font-weight: bold;
  text-align: center;
  margin-left: 12px;
`;

const Status = styled(Disclaimer)`
  width: 100px;
  text-align: left;
`;

const Substatus = styled(Disclaimer)`
  width: 100px;
  text-align: left;
  margin-left: 20px;
  line-height: 10px;
`;

const Circle = styled.div<{ color: string }>`
  background-color: ${({ color }) => color};
  border-radius: 4px;
  width: 8px;
  height: 8px;
  margin-right: 12px;
`;

const TotalCountContainer = styled.div<{ opacity?: number }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  opacity: ${({ opacity }) => opacity || 1};
`;

const FlexColumnContainer = styled.div`
  width: 150px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  color: ${gray.dark2};
`;

const sharedFontCss = css`
  font-size: 9px;
  letter-spacing: 0.15px;
  color: ${gray.dark2};
  line-height: 12px;
`;
