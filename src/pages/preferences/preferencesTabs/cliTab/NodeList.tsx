import React from "react";
import Styled from "@emotion/styled";
import { NodeType, Node } from "./nodeList/Node";

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
  width: 80%;
  :after {
    content:"";
    position: absolute;
    left: 36px;
    top: 5%;
    height: 100%;
    width: 1px;
    background: black;
    z-index:-10;
  }
`;
