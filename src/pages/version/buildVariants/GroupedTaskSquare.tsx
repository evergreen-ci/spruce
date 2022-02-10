import styled from "@emotion/styled";
import { useVersionAnalytics } from "analytics";
import { GroupedTaskStatusBadge } from "components/GroupedTaskStatusBadge";
import { size } from "constants/tokens";
import { TaskStatus } from "types/task";

interface Props {
  count: number;
  statuses: { [key: string]: number };
  variant: string;
  umbrellaStatus: string;
  versionId: string;
}

export const GroupedTaskSquare: React.FC<Props> = ({
  statuses,
  count,
  umbrellaStatus,
  variant,
  versionId,
}) => {
  const { sendEvent } = useVersionAnalytics(versionId);

  return (
    <GroupedTaskSquareWrapper>
      <GroupedTaskStatusBadge
        variant={variant}
        versionId={versionId}
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
  margin-right: ${size.xs};
`;
