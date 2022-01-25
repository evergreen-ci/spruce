import styled from "@emotion/styled";
import { useParams } from "react-router-dom";
import { usePatchAnalytics, useVersionAnalytics } from "analytics";
import { GroupedTaskStatusBadge } from "components/GroupedTaskStatusBadge";
import { TaskStatus } from "types/task";

interface Props {
  count: number;
  statuses: { [key: string]: number };
  variant: string;
  umbrellaStatus: string;
  isPatch: boolean;
}

export const GroupedTaskSquare: React.FC<Props> = ({
  statuses,
  count,
  umbrellaStatus,
  variant,
  isPatch,
}) => {
  const { sendEvent } = (isPatch ? usePatchAnalytics : useVersionAnalytics)();
  const { id } = useParams<{ id: string }>();

  return (
    <GroupedTaskSquareWrapper>
      <GroupedTaskStatusBadge
        variant={variant}
        versionId={id}
        status={umbrellaStatus as TaskStatus}
        count={count}
        onClick={() =>
          sendEvent({
            name: "Click Grouped Task Square",
            taskSquareStatuses: Object.keys(statuses),
          })
        }
        statusCounts={statuses}
      />{" "}
    </GroupedTaskSquareWrapper>
  );
};

const GroupedTaskSquareWrapper = styled.div`
  margin-right: 8px;
`;
