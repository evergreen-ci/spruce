import React from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import Tooltip from "@leafygreen-ui/tooltip";
import { Disclaimer } from "@leafygreen-ui/typography";
import { mapColorToTaskUmbrellaStatusCopy } from "constants/task";
import { ColorCount, getZeroCountStatusColors } from "./utils";

const { gray } = uiColors;
interface Props {
  groupedTaskStats: ColorCount[];
  trigger: React.ReactElement;
}

export const CommitChartTooltip: React.FC<Props> = ({
  groupedTaskStats,
  trigger,
}) => {
  const zeroCountStatusTextColors = getZeroCountStatusColors(groupedTaskStats);
  return (
    <Tooltip
      usePortal={false}
      align="right"
      justify="middle"
      popoverZIndex={1}
      trigger={trigger}
      triggerEvent="hover"
    >
      <TooltipContainer data-cy="commit-chart-tooltip" css={sharedCss}>
        {groupedTaskStats.map(({ color, count, statuses }) => (
          <FlexColumnContainer>
            <TotalCountContainer
              data-cy="current-StatusTextes-count"
              key={color}
            >
              <Circle color={color} />
              <StatusText
                css={sharedCss}
              >{`Total ${mapColorToTaskUmbrellaStatusCopy[color]}`}</StatusText>
              <NumberText css={sharedCss}>{count}</NumberText>
            </TotalCountContainer>
            <SubStatusText css={sharedCss}>{`(${statuses.join(
              ", "
            )})`}</SubStatusText>
          </FlexColumnContainer>
        ))}
        {zeroCountStatusTextColors.map((color) => (
          <TotalCountContainer
            opacity={0.4}
            data-cy="missing-StatusTextes-count"
            key={color}
          >
            <Circle color={color} />
            <StatusText
              css={sharedCss}
            >{`Total ${mapColorToTaskUmbrellaStatusCopy[color]}`}</StatusText>
            <NumberText css={sharedCss}>0</NumberText>
          </TotalCountContainer>
        ))}
      </TooltipContainer>
    </Tooltip>
  );
};

const TooltipContainer = styled.div`
  margin: auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-direction: column;
  background-color: ${gray.light3};
`;

const FlexColumnContainer = styled.div`
  width: 150px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  color: ${gray.dark2};
`;

const TotalCountContainer = styled.div<{ opacity?: number }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  color: ${gray.dark2};
  opacity: ${({ opacity }) => opacity || 1};
`;

const Circle = styled.div<{ color: string }>`
  background-color: ${({ color }) => color};
  border-radius: 4px;
  width: 8px;
  height: 8px;
  margin-right: 12px;
`;

const NumberText = styled(Disclaimer)`
  width: 40px;
  font-weight: bold;
  text-align: center;
  margin-left: 14px;
`;

const StatusText = styled(Disclaimer)`
  width: 100px;
  text-align: left;
`;

const SubStatusText = styled(Disclaimer)`
  width: 100px;
  text-align: left;
  margin: 2px 0px 0px 20px;
`;

const sharedCss = css`
  font-size: 9px;
  letter-spacing: 0.15px;
  line-height: 12px;
`;
