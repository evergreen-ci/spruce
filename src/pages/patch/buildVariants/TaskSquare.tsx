import React from "react";
import styled from "@emotion/styled/macro";
import { StyledRouterLink } from "components/styles";
import Tooltip from "@leafygreen-ui/tooltip";

interface Props {
  id: string;
  name: string;
  status: string;
}

export const TaskSquare: React.FC<Props> = ({ id, name, status }) => {
  return (
    <StyledRouterLink to={`/task/${id}`}>
      <Tooltip trigger={<Square />} variant="dark">
        {name}
      </Tooltip>
    </StyledRouterLink>
  );
};

const Square = styled.div`
  height: 12px;
  width: 12px;
  background-color: #13aa52;
  margin-right: 1px;
  margin-bottom: 1px;
`;
