import React from "react";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { Subtitle } from "@leafygreen-ui/typography";
import { size } from "constants/tokens";

const { green, white } = uiColors;

export type NodeType = {
  title: string;
  child?: JSX.Element;
};

interface NodeProps extends NodeType {
  stepNumber: number;
}
export const Node: React.FC<NodeProps> = ({ title, child, stepNumber }) => (
  <NodeContainer>
    <NodeHeader>
      <Step stepNumber={stepNumber} />
      {/* @ts-expect-error */}
      <NodeTitle>{title}</NodeTitle>
    </NodeHeader>
    {child && <ChildContainer>{child}</ChildContainer>}
  </NodeContainer>
);

interface StepProps {
  stepNumber: number;
}

const Step: React.FC<StepProps> = ({ stepNumber }) => (
  <Circle>
    {/* @ts-expect-error */}
    <Index>{stepNumber}</Index>
  </Circle>
);

const Circle = styled.div`
  min-height: 56px;
  min-width: 56px;
  background-color: ${green.base};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// @ts-expect-error
const Index = styled(Subtitle)`
  color: ${white};
`;

// @ts-expect-error
const NodeTitle = styled(Subtitle)`
  align-self: center;
  margin-left: ${size.m};
`;

const NodeContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${size.xxl};
`;

const NodeHeader = styled.div`
  display: flex;
`;

const ChildContainer = styled.div`
  margin-left: ${size.xxl};
`;
