import React from "react";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { format } from "date-fns";
import { Analytics } from "analytics/addPageAction";
import { PatchStatusBadge } from "components/PatchStatusBadge";
import { StyledRouterLink } from "components/styles";
import {
  getBuildStatusIconLink,
  getProjectPatchesRoute,
  getVersionRoute,
  getUserPatchesRoute,
} from "constants/routes";
import { Maybe, Patch } from "gql/generated/types";
import { BuildStatusIcon } from "./patchCard/BuildStatusIcon";
import { DropdownMenu } from "./patchCard/DropdownMenu";

const { gray } = uiColors;
interface Build {
  id: string;
  buildVariant: string;
  status: string;
}

interface Props {
  id: string;
  childPatches?: Partial<Patch>[];
  projectID: string;
  projectIdentifier: string;
  description: string;
  pageType: "project" | "user";
  status: string;
  createTime?: Maybe<Date>;
  builds: Build[];
  author: string;
  authorDisplayName: string;
  canEnqueueToCommitQueue: boolean;
  isPatchOnCommitQueue: boolean;
  analyticsObject?: Analytics<
    | { name: "Click Patch Link" }
    | {
        name: "Click Variant Icon";
        variantIconStatus: string;
      }
  >;
}

export const PatchCard: React.FC<Props> = ({
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
  builds,
  canEnqueueToCommitQueue,
  isPatchOnCommitQueue,
  analyticsObject,
}) => {
  const createDate = new Date(createTime);
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
        <BadgeContainer>
          <PatchStatusBadge status={status} />
        </BadgeContainer>
        <IconsContainer>
          {builds.map((b) => (
            <div key={b.id}>
              <BuildStatusIcon
                status={b.status}
                buildVariant={b.buildVariant}
                href={getBuildStatusIconLink(id, b.buildVariant)}
                onClick={() =>
                  analyticsObject?.sendEvent({
                    name: "Click Variant Icon",
                    variantIconStatus: b.status,
                  })
                }
              />
            </div>
          ))}
        </IconsContainer>
      </Center>
      <Right>
        <DropdownMenu
          patchId={id}
          childPatches={childPatches}
          canEnqueueToCommitQueue={canEnqueueToCommitQueue}
          isPatchOnCommitQueue={isPatchOnCommitQueue}
          patchDescription={description}
        />
      </Right>
    </CardWrapper>
  );
};

const IconsContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  > div {
    margin-right: 14px;
  }
  flex-wrap: wrap;
`;

const CardWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 5px 12px;
  border-bottom: 1px solid ${gray.light2};
`;

const Center = styled.div`
  display: flex;
  flex: 1 1 0;
`;

const Left = styled(Center)`
  flex-direction: column;
  padding-right: 24px;
`;

const Right = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const DescriptionLink = styled(StyledRouterLink)`
  font-size: 18px;
  font-weight: 500;
  padding-bottom: 8px;
`;

const BadgeContainer = styled.div`
  margin-right: 24px;
  min-width: 90px;
`;

const TimeAndProject = styled.div`
  color: ${gray.base};
`;
