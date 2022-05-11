import styled from "@emotion/styled";
import { GroupedTaskStatusBadge } from "components/GroupedTaskStatusBadge";
import { size } from "constants/tokens";
import { StatusCount } from "gql/generated/types";
import {
  GROUPED_BADGE_PADDING,
  GROUPED_BADGE_HEIGHT,
} from "pages/commits/constants";
import { groupStatusesByUmbrellaStatus } from "utils/statuses";

interface Props {
  variant: string;
  statusCounts: StatusCount[];
  versionId: string;
  onClick?: (statuses: string[]) => () => void;
  preserveSorts?: boolean;
}
const VariantGroupedTaskStatusBadges: React.VFC<Props> = ({
  variant,
  statusCounts,
  versionId,
  onClick = () => () => {},
  preserveSorts = false,
}) => {
  const { stats } = groupStatusesByUmbrellaStatus(statusCounts ?? []);

  return (
    <VariantTasks>
      {stats.map(
        ({ umbrellaStatus, count, statusCounts: groupedStatusCounts }) => (
          <GroupedTaskStatusBadge
            key={`${versionId}_${variant}_${umbrellaStatus}`}
            variant={variant}
            versionId={versionId}
            status={umbrellaStatus}
            count={count}
            onClick={onClick(Object.keys(groupedStatusCounts))}
            statusCounts={groupedStatusCounts}
            preserveSorts={preserveSorts}
          />
        )
      )}
    </VariantTasks>
  );
};

const VariantTasks = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: ${GROUPED_BADGE_PADDING}px 0;
  > * {
    height: ${GROUPED_BADGE_HEIGHT}px;
    padding: ${size.xxs} 0;
    padding-right: ${size.xs};
  }
`;

export { VariantGroupedTaskStatusBadges };
