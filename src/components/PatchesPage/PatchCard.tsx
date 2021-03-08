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
} from "constants/routes";
import { Maybe } from "gql/generated/types";
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
  projectID: string;
  description: string;
  status: string;
  createTime?: Maybe<Date>;
  builds: Build[];
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
  description,
  createTime,
  projectID,
  status,
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
          on{" "}
          <StyledRouterLink
            to={getProjectPatchesRoute(projectID)}
            data-cy="project-patches-link"
          >
            <b>{projectID}</b>
          </StyledRouterLink>
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
