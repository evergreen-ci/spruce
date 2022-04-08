import React from "react";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { zIndex } from "constants/tokens";
import { NodeType, Node } from "./nodeList/Node";

const { gray } = uiColors;
interface NodeListProps {
  list: NodeType[];
}
export const NodeList: React.VFC<NodeListProps> = ({ list }) => (
  <NodeContainer>
    {list.map((node, index) => (
      <Node
        key={node.title}
        title={node.title}
        child={node.child}
        stepNumber={index + 1}
      />
    ))}
  </NodeContainer>
);

const NodeContainer = styled.div`
  :last-child:after {
      background: ${gray.light2};
      content: "";
      left: 28px;
      position: absolute;
      top: 0%;
      height: 90%;
      width: 1px;
      z-index: ${zIndex.backdrop};
    }
  }
`;
