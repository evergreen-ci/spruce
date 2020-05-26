import React from "react";
import Styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { NodeType, Node } from "./nodeList/Node";

const { gray } = uiColors;
interface NodeListProps {
  list: NodeType[];
}
export const NodeList: React.FC<NodeListProps> = ({ list }) => (
  <NodeContainer>
    {list.map((node, index) => (
      <Node title={node.title} child={node.child} index={index} />
    ))}
  </NodeContainer>
);

const NodeContainer = Styled.div`
  :after {
    content:"";
    position: absolute;
    left: 28px;
    top: 5%;
    height: 100%;
    width: 1px;
    background: ${gray.light2};
    z-index:0;
  }
`;
