import React from "react";
import { Tooltip } from "antd";
import { usePatchAnalytics } from "analytics";
import { mapVariantTaskStatusToColor, Square } from "components/StatusSquare";
import { StyledRouterLink } from "components/styles";

interface Props {
  id: string;
  name: string;
  status: string;
}

export const TaskSquare: React.FC<Props> = ({ id, name, status }) => {
  const patchAnalytics = usePatchAnalytics();

  return (
    <StyledRouterLink
      to={`/task/${id}`}
      data-cy="task-square"
      onClick={() =>
        patchAnalytics.sendEvent({
          name: "Click Task Square",
          taskSquareStatus: status,
        })
      }
    >
      <Tooltip title={<span data-cy="task-square-tooltip">{name}</span>}>
        <Square color={mapVariantTaskStatusToColor[status]} />
      </Tooltip>
    </StyledRouterLink>
  );
};
