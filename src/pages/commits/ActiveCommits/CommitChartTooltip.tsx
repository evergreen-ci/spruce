import React from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import Tooltip from "@leafygreen-ui/tooltip";
import { Disclaimer } from "@leafygreen-ui/typography";
import { inactiveElementStyle } from "components/styles";
import { taskStatusToCopy, mapTaskToBarchartColor } from "constants/task";
import { size, fontSize } from "constants/tokens";

import { TaskStatus } from "types/task";
import { tooltipZIndex } from "../constants";
import { ColorCount, getStatusesWithZeroCount } from "./utils";

const { gray } = uiColors;
interface Props {
  groupedTaskStats: ColorCount[];
  trigger: React.ReactElement;
}

export const CommitChartTooltip: React.FC<Props> = ({
  groupedTaskStats,
  trigger,
}) => {
  const zeroCountStatus = getStatusesWithZeroCount(groupedTaskStats);
  return (
    <Tooltip
      usePortal={false}
      align="right"
      justify="middle"
      popoverZIndex={tooltipZIndex}
      trigger={trigger}
      triggerEvent="hover"
    >
      <TooltipContainer data-cy="commit-chart-tooltip" css={sharedCss}>
        {groupedTaskStats.map(({ color, count, statuses, umbrellaStatus }) => (
          <FlexColumnContainer key={color} data-cy="current-status-count">
            <TotalCount
              status={umbrellaStatus}
              color={color}
              count={count}
              active
            />
            {umbrellaStatus === TaskStatus.Failed && (
              <SubStatusText css={sharedCss}>{`(${statuses.join(
                ", "
              )})`}</SubStatusText>
            )}
          </FlexColumnContainer>
        ))}
        {zeroCountStatus.map((umbrellaStatus) => (
          <TotalCount
            key={umbrellaStatus}
            status={umbrellaStatus}
            color={mapTaskToBarchartColor[umbrellaStatus]}
            count={0}
            active={false}
          />
        ))}
      </TooltipContainer>
    </Tooltip>
  );
};

interface TotalCountProps {
  color: string;
  count: number;
  status: string;
  active?: boolean;
}
export const TotalCount: React.FC<TotalCountProps> = ({
  color,
  count,
  status,
  active = true,
}) => (
  <TotalCountContainer active={active}>
    <Circle color={color} />
    <StatusText
      css={sharedCss}
    >{`Total ${taskStatusToCopy[status]}`}</StatusText>
    <NumberText css={sharedCss}>{count}</NumberText>
  </TotalCountContainer>
);

const TooltipContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
`;

const FlexColumnContainer = styled.div`
  width: 150px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  color: ${gray.dark2};
`;

const TotalCountContainer = styled.div<{ active?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${size.xs};
  color: ${gray.dark2};
  ${({ active }) => !active && inactiveElementStyle};
`;

const Circle = styled.div<{ color: string }>`
  background-color: ${({ color }) => color};
  border-radius: ${size.xxs};
  width: ${size.xs};
  height: ${size.xs};
  margin-right: ${size.s};
`;

const NumberText = styled(Disclaimer)`
  width: ${size.l};
  font-weight: bold;
  text-align: center;
`;

const StatusText = styled(Disclaimer)`
  width: ${size.xxl};
  text-align: left;
`;

const SubStatusText = styled(Disclaimer)`
  width: ${size.xxl};
  text-align: left;
  margin: 2px 0px 0px 20px;
  word-break: break-word;
`;

const sharedCss = css`
  font-size: ${fontSize.s};
  line-height: ${size.s};
`;
