import styled from "@emotion/styled";
import { useProjectHealthAnalytics } from "analytics/projectHealth/useProjectHealthAnalytics";
import { StyledRouterLink } from "components/styles";
import { VariantGroupedTaskStatusBadges } from "components/VariantGroupedTaskStatusBadges";
import VisibilityContainer from "components/VisibilityContainer";
import { getVariantHistoryRoute } from "constants/routes";
import { size } from "constants/tokens";
import { StatusCount } from "gql/generated/types";
import { TASK_ICON_PADDING } from "../constants";
import { WaterfallTaskStatusIcon } from "./buildVariantCard/WaterfallTaskStatusIcon";
import { injectGlobalDimStyle, removeGlobalDimStyle } from "./utils";

type taskList = {
  id: string;
  status: string;
  displayName: string;
  timeTaken?: number;
  failedTestCount?: number;
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

const RenderTaskIcons: React.VFC<RenderTaskIconsProps> = ({ tasks, variant }) =>
  tasks.length ? (
    <IconContainer
      data-cy="build-variant-icon-container"
      onMouseEnter={() => injectGlobalDimStyle()}
      onMouseLeave={() => removeGlobalDimStyle()}
    >
      {tasks.map(({ id, status, displayName, timeTaken, failedTestCount }) => (
        <WaterfallTaskStatusIcon
          key={id}
          taskId={id}
          status={status}
          displayName={displayName}
          timeTaken={timeTaken}
          identifier={`${variant}-${displayName}`}
          failedTestCount={failedTestCount}
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
