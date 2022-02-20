import styled from "@emotion/styled";
import { GroupedTaskStatusBadge } from "components/GroupedTaskStatusBadge";
import { StyledRouterLink } from "components/styles";
import { getVariantHistoryRoute } from "constants/routes";
import { size } from "constants/tokens";
import { StatusCount } from "gql/generated/types";
import { groupStatusesByUmbrellaStatus } from "utils/statuses";
import { WaterfallTaskStatusIcon } from "./buildVariantCard/WaterfallTaskStatusIcon";

type taskList = {
  id: string;
  status: string;
  displayName: string;
  timeTaken?: number;
}[];
interface Props {
  variant: string;
  buildVariantDisplayName: string;
  tasks?: taskList;
  versionId: string;
  projectIdentifier: string;
  groupedVariantStats: {
    statusCounts: StatusCount[];
  };
}
export const BuildVariantCard: React.FC<Props> = ({
  buildVariantDisplayName,
  variant,
  tasks,
  versionId,
  projectIdentifier,
  groupedVariantStats,
}) => {
  let render = null;
  render = (
    <>
      {groupedVariantStats && (
        <RenderGroupedIcons
          statusCounts={groupedVariantStats.statusCounts}
          versionId={versionId}
          variant={variant}
        />
      )}
      {tasks && <RenderTaskIcons tasks={tasks} />}
    </>
  );
  return (
    <Container>
      <Label to={getVariantHistoryRoute(projectIdentifier, variant)}>
        {buildVariantDisplayName}
      </Label>
      {render}
    </Container>
  );
};

interface RenderGroupedIconsProps {
  statusCounts: StatusCount[];
  versionId: string;
  variant: string;
}
const RenderGroupedIcons: React.FC<RenderGroupedIconsProps> = ({
  statusCounts,
  versionId,
  variant,
}) => {
  const { stats } = groupStatusesByUmbrellaStatus(statusCounts);
  return (
    <VariantTasks>
      {stats.map(
        ({ umbrellaStatus, count, statusCounts: groupedStatusCounts }) => (
          <>
            <GroupedTaskStatusBadge
              variant={variant}
              versionId={versionId}
              status={umbrellaStatus}
              count={count}
              statusCounts={groupedStatusCounts}
            />
          </>
        )
      )}
    </VariantTasks>
  );
};
interface RenderTaskIconsProps {
  tasks: taskList;
}

const RenderTaskIcons: React.FC<RenderTaskIconsProps> = ({ tasks }) =>
  tasks.length ? (
    <IconContainer>
      {tasks.map(({ id, status, displayName, timeTaken }) => (
        <WaterfallTaskStatusIcon
          key={id}
          taskId={id}
          status={status}
          displayName={displayName}
          timeTaken={timeTaken}
        />
      ))}
    </IconContainer>
  ) : null;

const Label = styled(StyledRouterLink)`
  word-break: break-word;
`;

const IconContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: ${size.xs};
  margin-top: ${size.xs};
  flex-wrap: wrap;
`;

const Container = styled.div`
  width: 160px;
  margin-bottom: ${size.s};
`;

const VariantTasks = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: ${size.xs};
  > * {
    margin-right: ${size.xs};
    margin-bottom: ${size.xs};
  }
`;
