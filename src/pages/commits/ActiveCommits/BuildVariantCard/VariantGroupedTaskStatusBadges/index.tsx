import styled from "@emotion/styled";
import { GroupedTaskStatusBadge } from "components/GroupedTaskStatusBadge";
import { getVersionRoute } from "constants/routes";
import { mapUmbrellaStatusToQueryParam } from "constants/task";
import { size } from "constants/tokens";
import { StatusCount } from "gql/generated/types";
import {
  GROUPED_BADGE_PADDING,
  GROUPED_BADGE_HEIGHT,
} from "pages/commits/constants";
import { string, statuses } from "utils";

const { applyStrictRegex } = string;
const { groupStatusesByUmbrellaStatus } = statuses;

interface Props {
  variant: string;
  statusCounts: StatusCount[];
  versionId: string;
  onClick?: (statuses: string[]) => () => void;
}

const VariantGroupedTaskStatusBadges: React.FC<Props> = ({
  onClick = () => () => {},
  statusCounts,
  variant,
  versionId,
}) => {
  const { stats } = groupStatusesByUmbrellaStatus(statusCounts ?? []);

  return (
    <VariantTasks>
      {stats.map(
        ({ count, statusCounts: groupedStatusCounts, umbrellaStatus }) => (
          <GroupedTaskStatusBadge
            key={`${versionId}_${variant}_${umbrellaStatus}`}
            count={count}
            onClick={onClick(Object.keys(groupedStatusCounts))}
            href={getVersionRoute(versionId, {
              variant: applyStrictRegex(variant),
              statuses: mapUmbrellaStatusToQueryParam[umbrellaStatus],
            })}
            statusCounts={groupedStatusCounts}
            status={umbrellaStatus}
          />
        ),
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
