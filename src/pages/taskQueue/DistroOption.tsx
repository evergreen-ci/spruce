import React from "react";
import styled from "@emotion/styled";
import Badge from "@leafygreen-ui/badge";
import { uiColors } from "@leafygreen-ui/palette";
import { Disclaimer } from "@leafygreen-ui/typography";

const { blue } = uiColors;

interface DistroOptionProps {
  id: string;
  taskCount: number;
  hostCount: number;
  onClick: (val: string) => void;
}

export const DistroOption: React.FC<DistroOptionProps> = ({
  id,
  taskCount,
  hostCount,
  onClick,
}) => (
  <OptionWrapper onClick={() => onClick(id)}>
    <StyledBadge>{`${taskCount} ${
      taskCount === 1 ? "TASK" : "TASKS"
    }`}</StyledBadge>
    <StyledBadge>{`${hostCount} ${
      hostCount === 1 ? "HOST" : "HOSTS"
    }`}</StyledBadge>
    <DistroName>{id}</DistroName>
  </OptionWrapper>
);

const OptionWrapper = styled.div`
  display: flex;
  padding: 8px;
  max-height: 500px;
  overflow-y: scroll;
  &:hover {
    cursor: pointer;
    background-color: ${blue.light3};
  }
`;
const StyledBadge = styled(Badge)`
  display: inline-flex;
  justify-content: center;
  width: 60px;
  text-align: center;
  margin-right: 6px;
`;
const DistroName = styled(Disclaimer)`
  margin-left: 16px;
`;
