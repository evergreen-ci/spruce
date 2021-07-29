import React from "react";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { Body } from "@leafygreen-ui/typography";

const { gray } = uiColors;

interface Props {
  status: string;
  color: string;
  count: number;
  borderColor: string;
}
export const GroupedTaskStatusBadge: React.FC<Props> = ({
  color,
  count,
  status,
  borderColor,
}) => (
  <Container color={color} borderColor={borderColor}>
    <Number>{count}</Number>
    <Status>{status}</Status>
  </Container>
);

const Container = styled.div<{ color: string; borderColor: string }>`
  height: 27px;
  width: 55px;
  border-radius: 3px;
  background: ${({ color }) => color};
  border: 0.75px solid ${({ borderColor }) => borderColor};
  box-sizing: border-box;
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
`;

const Number = styled(Body)`
  font-weight: bold;
  font-size: 11px;
  letter-spacing: 0.18px;
  line-height: 10px;
  color: #116149;
`;

const Status = styled(Body)`
  font-size: 8px;
  letter-spacing: 0.13px;
  line-height: 10px;
  color: #116149;
`;
