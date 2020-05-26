import React from "react";
import Styled from "@emotion/styled";
import { Subtitle } from "@leafygreen-ui/typography";
import { uiColors } from "@leafygreen-ui/palette";

const { green, white } = uiColors;

export type NodeType = {
  title: string;
  child: JSX.Element;
};

interface NodeProps extends NodeType {
  index: number;
}
export const Node: React.FC<NodeProps> = ({ title, child, index }) => (
  <NodeContainer>
    <NodeHeader>
      <Step index={index + 1} />
      <NodeTitle>{title}</NodeTitle>
    </NodeHeader>
    <ChildContainer>{child}</ChildContainer>
  </NodeContainer>
);

interface StepProps {
  index: number;
}

const Step: React.FC<StepProps> = ({ index }) => (
  <Circle>
    <Index>{index}</Index>
  </Circle>
);
const Circle = Styled.div`
  height: 56px;
  width: 56px;
  background-color: ${green.base};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
`;

const Index = Styled(Subtitle)`
  color: ${white};
`;

const NodeTitle = Styled(Subtitle)`
  align-self: center;
  margin-left: 24px;
`;
const NodeContainer = Styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 80px;
`;

const NodeHeader = Styled.div`
  display: flex;
`;

const ChildContainer = Styled.div`
  margin-left: 80px;
`;
