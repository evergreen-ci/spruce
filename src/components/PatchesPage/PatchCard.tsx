import React from "react";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { format } from "date-fns";
import { Analytics } from "analytics/addPageAction";
import { GroupedTaskStatusBadge } from "components/GroupedTaskStatusBadge";
import { PatchStatusBadge } from "components/PatchStatusBadge";
import { StyledRouterLink } from "components/styles";
import {
  getProjectPatchesRoute,
  getVersionRoute,
  getUserPatchesRoute,
} from "constants/routes";
import { fontSize, size } from "constants/tokens";
import { PatchesPagePatchesFragment } from "gql/generated/types";
import { Unpacked } from "types/utils";
import { groupStatusesByUmbrellaStatus } from "utils/statuses";
import { DropdownMenu } from "./patchCard/DropdownMenu";

type P = Unpacked<PatchesPagePatchesFragment["patches"]>;
type PatchProps = Omit<P, "commitQueuePosition">;
const { gray } = uiColors;

interface Props extends PatchProps {
  pageType: "project" | "user";
  isPatchOnCommitQueue: boolean;
  analyticsObject?: Analytics<
    | { name: "Click Patch Link" }
    | {
        name: "Click Variant Icon";
        variantIconStatus: string;
      }
  >;
}

export const PatchCard: React.VFC<Props> = ({
  id,
  childPatches,
  description,
  createTime,
  author,
  authorDisplayName,
  projectID,
  projectIdentifier,
  status,
  pageType,
  canEnqueueToCommitQueue,
  isPatchOnCommitQueue,
  analyticsObject,
  versionFull,
}) => {
  const createDate = new Date(createTime);
  const { taskStatusCounts, id: versionId } = versionFull || {};
  const { stats } = groupStatusesByUmbrellaStatus(taskStatusCounts ?? []);
  const badges = stats?.map(({ count, umbrellaStatus, statusCounts }) => (
    <GroupedTaskStatusBadge
      status={umbrellaStatus}
      count={count}
      statusCounts={statusCounts}
      versionId={versionId}
      key={`${versionId}_${umbrellaStatus}`}
    />
  ));
  return (
    <CardWrapper data-cy="patch-card">
      <Left>
        <DescriptionLink
          data-cy="patch-card-patch-link"
          to={getVersionRoute(id)}
          onClick={() =>
            analyticsObject?.sendEvent({ name: "Click Patch Link" })
          }
        >
          {description || "no description"}
        </DescriptionLink>
        <TimeAndProject>
          {format(createDate, "M/d/yy")} at {format(createDate, "h:mm:ss aaaa")}{" "}
          {pageType === "project" ? "by" : "on"}{" "}
          {pageType === "project" ? (
            <StyledRouterLink
              to={getUserPatchesRoute(author)}
              data-cy="user-patches-link"
            >
              <b>{authorDisplayName}</b>
            </StyledRouterLink>
          ) : (
            <StyledRouterLink
              to={getProjectPatchesRoute(projectID)}
              data-cy="project-patches-link"
            >
              <b>{projectIdentifier}</b>
            </StyledRouterLink>
          )}
        </TimeAndProject>
      </Left>
      <Center>
        <PatchBadgeContainer>
          <PatchStatusBadge status={versionFull.status ?? status} />
        </PatchBadgeContainer>
        <TaskBadgeContainer>{badges}</TaskBadgeContainer>
      </Center>
      <Right>
        <DropdownMenu
          patchId={id}
          childPatches={childPatches}
          canEnqueueToCommitQueue={canEnqueueToCommitQueue}
          isPatchOnCommitQueue={isPatchOnCommitQueue}
          patchDescription={description}
          hasVersion={!!versionId}
        />
      </Right>
    </CardWrapper>
  );
};

const TaskBadgeContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  > * {
    margin-right: ${size.s};
  }
  flex-wrap: wrap;
`;

const CardWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${size.s} ${size.xxs};
  border-bottom: 1px solid ${gray.light2};
`;

const Center = styled.div`
  display: flex;
  flex: 1 1 0;
`;

const Left = styled(Center)`
  flex-direction: column;
  padding-right: ${size.m};
`;

const Right = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const DescriptionLink = styled(StyledRouterLink)`
  font-size: ${fontSize.l};
  font-weight: 500;
  padding-bottom: ${size.xs};
`;

const PatchBadgeContainer = styled.div`
  margin-right: ${size.m};
  min-width: ${size.xxl};
`;

const TimeAndProject = styled.div`
  color: ${gray.base};
`;
