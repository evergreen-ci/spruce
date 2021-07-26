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
          {groupedTaskStats.map((colorCount) => (
            <Bar
              data-cy="commit-chart-bar"
              key={colorCount.color}
              height={calculateBarHeight(
                colorCount.count,
                max,
                total,
                chartType
              )}
              color={colorCount.color}
            />
          ))}
        </ChartContainer>
      }
      triggerEvent="hover"
    >
      <TooltipContainer data-cy="commit-chart-tooltip">
        {groupedTaskStats.map((colorCount) => (
          <TotalCountContainer
            css={sharedFontCss}
            data-cy="current-statuses-count"
            key={colorCount.color}
          >
            <Circle color={colorCount.color} />
            {`Total ${mapColorToTaskUmbrellaStatusCopy[colorCount.color]}`}
            <Number css={sharedFontCss}>{colorCount.count}</Number>
          </TotalCountContainer>
        ))}
        {zeroCountStatusColors.map((color) => (
          <TotalCountContainer
            css={sharedFontCss}
            opacity={0.4}
            data-cy="missing-statuses-count"
            key={color}
          >
            <Circle color={color} />
            {`Total ${mapColorToTaskUmbrellaStatusCopy[color]}`}
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
  width: 150px;
  height: 160px;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  background-color: ${gray.light3};
`;

const Number = styled(Disclaimer)`
  width: 40px;
  font-weight: bold;
  text-align: center;
  position: absolute;
  margin-left: 120px;
`;

const Circle = styled.div<{ color: string }>`
  background-color: ${({ color }) => color};
  border-radius: 4px;
  width: 8px;
  height: 8px;
  margin-right: 18px;
`;

const TotalCountContainer = styled(Disclaimer)<{ opacity?: number }>`
  width: 116px;
  text-align: left;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  color: ${gray.dark2};
  opacity: ${({ opacity }) => opacity || 1};
`;

const sharedFontCss = css`
  font-size: 9px;
  letter-spacing: 0.15px;
`;
