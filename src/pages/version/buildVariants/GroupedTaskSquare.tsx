import styled from "@emotion/styled";
import { Tooltip } from "antd";
import { useParams } from "react-router-dom";
import { usePatchAnalytics } from "analytics";
import { GroupedTaskStatusBadge } from "components/GroupedTaskStatusBadge";
import { StyledRouterLink } from "components/styles";
import { getVersionRoute } from "constants/routes";
import { applyStrictRegex } from "utils/string";

interface Props {
  count: number;
  statuses: string[];
  variant: string;
  umbrellaStatus: string;
}

export const GroupedTaskSquare: React.FC<Props> = ({
  statuses,
  count,
  umbrellaStatus,
  variant,
}) => {
  const patchAnalytics = usePatchAnalytics();
  const { id } = useParams<{ id: string }>();

  const filteredRoute = `${getVersionRoute(id, {
    statuses,
    variant: applyStrictRegex(variant),
    page: 0,
  })}`;
  const multipleStatuses = statuses.length > 1;
  const tooltipCopy = `${count} ${count > 1 ? "tasks" : "task"} with ${
    multipleStatuses ? "statuses" : "status"
  }: ${statuses.join()}`;
  return (
    <GroupedTaskSquareWrapper>
      <StyledRouterLink
        to={filteredRoute}
        data-cy="task-square"
        onClick={() =>
          patchAnalytics.sendEvent({
            name: "Click Grouped Task Square",
            taskSquareStatuses: statuses,
          })
        }
      >
        <Tooltip
          title={<span data-cy="task-square-tooltip">{tooltipCopy}</span>}
        >
          <GroupedTaskStatusBadge status={umbrellaStatus} count={count} />{" "}
        </Tooltip>
      </StyledRouterLink>
    </GroupedTaskSquareWrapper>
  );
};

const GroupedTaskSquareWrapper = styled.div`
  margin-right: 8px;
`;
