import React from "react";
import { StyledRouterLink } from "components/styles";
import Tooltip from "@leafygreen-ui/tooltip";
import { mapVariantTaskStatusToColor, Square } from "./variantColors";

interface Props {
  id: string;
  name: string;
  status: string;
}

export const TaskSquare: React.FC<Props> = ({ id, name, status }) => (
  <StyledRouterLink to={`/task/${id}`} className="task-square">
    <Tooltip
      trigger={<Square color={mapVariantTaskStatusToColor[status]} />}
      variant="dark"
      className="task-square-tooltip"
    >
      {name}
    </Tooltip>
  </StyledRouterLink>
);
