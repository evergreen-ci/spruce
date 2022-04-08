import styled from "@emotion/styled";
import { StyledRouterLink } from "components/styles";
import { VariantGroupedTaskStatusBadges } from "components/VariantGroupedTaskStatusBadges";
import { getVariantHistoryRoute } from "constants/routes";
import { size } from "constants/tokens";
import { StatusCount } from "gql/generated/types";
import { TASK_ICON_PADDING } from "../constants";
import { WaterfallTaskStatusIcon } from "./buildVariantCard/WaterfallTaskStatusIcon";

type taskList = {
  id: string;
  status: string;
  displayName: string;
  timeTaken?: number;
}[];
interface Props {
  variant: string;
  height: number;
  buildVariantDisplayName: string;
  tasks?: taskList;
  versionId: string;
  projectIdentifier: string;
  groupedVariantStats: {
    statusCounts: StatusCount[];
  };
  order: number;
}
export const BuildVariantCard: React.VFC<Props> = ({
  buildVariantDisplayName,
  height,
  variant,
  tasks,
  versionId,
  projectIdentifier,
  groupedVariantStats,
  order,
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
      {tasks && <RenderTaskIcons tasks={tasks} variant={variant} />}
    </>
  );
  return (
    <Container>
      <Label
        data-cy="variant-header"
        to={getVariantHistoryRoute(projectIdentifier, variant, {
          selectedCommit: order,
        })}
      >
        {buildVariantDisplayName}
      </Label>
      <div style={{ height }}>{render}</div>
    </Container>
  );
};

interface RenderTaskIconsProps {
  tasks: taskList;
  variant: string;
}

const RenderTaskIcons: React.VFC<RenderTaskIconsProps> = ({ tasks, variant }) =>
  tasks.length ? (
    <IconContainer>
      {tasks.map(({ id, status, displayName, timeTaken }) => (
        <WaterfallTaskStatusIcon
          key={id}
          taskId={id}
          status={status}
          displayName={displayName}
          timeTaken={timeTaken}
          identifier={`${variant}-${displayName}`}
        />
      ))}
    </IconContainer>
  ) : null;

const Label = styled(StyledRouterLink)`
  word-break: break-word;
`;

const IconContainer = styled.div`
  display: flex;
  padding: ${TASK_ICON_PADDING}px 0;
  flex-wrap: wrap;
`;

const Container = styled.div`
  width: 160px;
  margin-bottom: ${size.s};
`;
