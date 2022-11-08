import styled from "@emotion/styled";
import { GroupedTaskStatusBadge } from "components/GroupedTaskStatusBadge";
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

const VariantGroupedTaskStatusBadges: React.VFC<Props> = ({
  variant,
  statusCounts,
  versionId,
  onClick = () => () => {},
}) => {
  const { stats } = groupStatusesByUmbrellaStatus(statusCounts ?? []);
  const queryParamsToPreserve = { variant: applyStrictRegex(variant) };

  return (
    <VariantTasks>
      {stats.map(
        ({ umbrellaStatus, count, statusCounts: groupedStatusCounts }) => (
          <GroupedTaskStatusBadge
            key={`${versionId}_${variant}_${umbrellaStatus}`}
            count={count}
            onClick={onClick(Object.keys(groupedStatusCounts))}
            queryParamsToPreserve={queryParamsToPreserve}
            status={umbrellaStatus}
            statusCounts={groupedStatusCounts}
            versionId={versionId}
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
