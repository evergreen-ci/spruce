import styled from "@emotion/styled";
import { StyledRouterLink } from "components/styles";
import { VariantGroupedTaskStatusBadges } from "components/VariantGroupedTaskStatusBadges";
import { getVariantHistoryRoute } from "constants/routes";
import { size } from "constants/tokens";
import { StatusCount } from "gql/generated/types";
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
        <VariantGroupedTaskStatusBadges
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
      <Label
        data-cy="variant-header"
        to={getVariantHistoryRoute(projectIdentifier, variant)}
      >
        {buildVariantDisplayName}
      </Label>
      {render}
    </Container>
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
