import styled from "@emotion/styled";
import { GroupedTaskStatusBadge } from "components/GroupedTaskStatusBadge";
import { size } from "constants/tokens";
import { StatusCount } from "gql/generated/types";
import { groupStatusesByUmbrellaStatus } from "utils/statuses";

interface Props {
  variant: string;
  statusCounts: StatusCount[];
  versionId: string;
  onClick?: (statuses: string[]) => () => void;
}
const VariantGroupedTaskStatusBadges: React.FC<Props> = ({
  variant,
  statusCounts,
  versionId,
  onClick = () => () => {},
}) => {
  const { stats } = groupStatusesByUmbrellaStatus(statusCounts ?? []);

  return (
    <VariantTasks>
      {stats.map(
        ({ umbrellaStatus, count, statusCounts: groupedStatusCounts }) => (
          <GroupedTaskStatusBadge
            variant={variant}
            versionId={versionId}
            status={umbrellaStatus}
            count={count}
            onClick={onClick(Object.keys(groupedStatusCounts))}
            statusCounts={groupedStatusCounts}
            key={`${versionId}_${variant}_${umbrellaStatus}`}
          />
        )
      )}
    </VariantTasks>
  );
};

const VariantTasks = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding-top: ${size.xs};
  > * {
    padding-right: ${size.xs};
    padding-bottom: ${size.xs};
  }
`;

export { VariantGroupedTaskStatusBadges };
