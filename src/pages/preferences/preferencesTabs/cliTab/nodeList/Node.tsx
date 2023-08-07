import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { Subtitle, SubtitleProps } from "@leafygreen-ui/typography";
import { size } from "constants/tokens";

const { green, white } = palette;

export type NodeType = {
  title: React.ReactNode;
  child?: JSX.Element;
};

interface NodeProps extends NodeType {
  stepNumber: number;
}
export const Node: React.FC<NodeProps> = ({ child, stepNumber, title }) => (
  <NodeContainer>
    <NodeHeader>
      <Step stepNumber={stepNumber} />
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
    <Index>{stepNumber}</Index>
  </Circle>
);

const Circle = styled.div`
  min-height: 56px;
  min-width: 56px;
  background-color: ${green.dark1};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Index = styled(Subtitle)<SubtitleProps>`
  color: ${white};
`;

const NodeTitle = styled(Subtitle)<SubtitleProps>`
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
