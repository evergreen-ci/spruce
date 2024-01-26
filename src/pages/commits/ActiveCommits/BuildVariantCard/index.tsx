import styled from "@emotion/styled";
import { useProjectHealthAnalytics } from "analytics/projectHealth/useProjectHealthAnalytics";
import { StyledRouterLink } from "components/styles";
import VisibilityContainer from "components/VisibilityContainer";
import { getVariantHistoryRoute } from "constants/routes";
import { size } from "constants/tokens";
import { StatusCount } from "gql/generated/types";
import { VariantGroupedTaskStatusBadges } from "pages/commits/ActiveCommits/BuildVariantCard/VariantGroupedTaskStatusBadges";
import {
  injectGlobalDimStyle,
  removeGlobalDimStyle,
} from "pages/commits/ActiveCommits/utils";
import { TASK_ICON_PADDING } from "pages/commits/constants";
import { WaterfallTaskStatusIcon } from "./WaterfallTaskStatusIcon";

type taskList = {
  id: string;
  status: string;
  displayName: string;
  timeTaken?: number;
  hasCedarResults: boolean;
}[];
interface Props {
  variant: string;
  height: number;
  buildVariantDisplayName: string;
  tasks?: taskList;
  versionId: string;
  projectIdentifier: string;
  groupedVariantStats?: {
    statusCounts: StatusCount[];
  };
  order: number;
}
export const BuildVariantCard: React.FC<Props> = ({
  buildVariantDisplayName,
  groupedVariantStats,
  height,
  order,
  projectIdentifier,
  tasks,
  variant,
  versionId,
}) => {
  const { sendEvent } = useProjectHealthAnalytics({ page: "Commit chart" });
  let render = null;
  render = (
    <>
      {groupedVariantStats && (
        <VariantGroupedTaskStatusBadges
          statusCounts={groupedVariantStats.statusCounts}
          versionId={versionId}
          variant={variant}
          onClick={(statuses) => () => {
            sendEvent({
              name: "Click grouped task status badge",
              statuses,
            });
          }}
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
        onClick={() => {
          sendEvent({
            name: "Click variant label",
          });
        }}
      >
        {buildVariantDisplayName}
      </Label>
      <Content height={`${height}px`}>
        <VisibilityContainer>{render}</VisibilityContainer>
      </Content>
    </Container>
  );
};

interface RenderTaskIconsProps {
  tasks: taskList;
  variant: string;
}

const RenderTaskIcons: React.FC<RenderTaskIconsProps> = ({ tasks, variant }) =>
  tasks.length ? (
    <IconContainer
      data-cy="build-variant-icon-container"
      onMouseEnter={() => injectGlobalDimStyle()}
      onMouseLeave={() => removeGlobalDimStyle()}
    >
      {tasks.map(({ displayName, hasCedarResults, id, status, timeTaken }) => (
        <WaterfallTaskStatusIcon
          key={id}
          taskId={id}
          status={status}
          displayName={displayName}
          timeTaken={timeTaken}
          identifier={`${variant}-${displayName}`}
          hasCedarResults={hasCedarResults}
        />
      ))}
    </IconContainer>
  ) : null;

const Label = styled(StyledRouterLink)`
  word-break: normal;
  overflow-wrap: anywhere;
`;

const IconContainer = styled.div`
  display: flex;
  padding: ${TASK_ICON_PADDING}px 0;
  flex-wrap: wrap;
  width: fit-content;
`;

const Container = styled.div`
  width: 160px;
  margin-bottom: ${size.s};
`;

const Content = styled.div<{ height: string }>`
  height: ${({ height }) => height};
`;
