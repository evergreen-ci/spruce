import React from "react";
import styled from "@emotion/styled";
import { uiColors } from "@leafygreen-ui/palette";
import { Breadcrumb } from "antd";
import { useBreadcrumbAnalytics } from "analytics";
import { StyledRouterLink } from "components/styles/StyledLink";
import { H3, P1 } from "components/Typography";
import { getVersionRoute } from "constants/routes";
import { useGetUserPatchesPageTitleAndLink } from "hooks";

const { blue } = uiColors;

interface Props {
  versionId?: string; // only required when rendered on task page
  taskName?: string;
  patchNumber: number;
  patchAuthor: string;
}

export const BreadCrumb: React.FC<Props> = ({
  versionId,
  taskName,
  patchNumber,
  patchAuthor,
}) => {
  const breadcrumbAnalytics = useBreadcrumbAnalytics();
  const patch = `Patch ${patchNumber}`;
  const {
    title: userPatchesPageTitle,
    link: userPatchesPageLink,
  } = useGetUserPatchesPageTitleAndLink(patchAuthor);
  return (
    <StyledBreadcrumb>
      <Breadcrumb.Item>
        <StyledP1>
          <StyledBreadcrumbLink
            id="bc-my-patches"
            to={userPatchesPageLink}
            onClick={() =>
              breadcrumbAnalytics.sendEvent({
                name: "Click Link",
                link: "myPatches",
              })
            }
          >
            {userPatchesPageTitle}
          </StyledBreadcrumbLink>
        </StyledP1>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        {taskName ? (
          <StyledP1>
            <StyledBreadcrumbLink
              data-cy="bc-patch"
              to={getVersionRoute(versionId)}
              onClick={() =>
                breadcrumbAnalytics.sendEvent({
                  name: "Click Link",
                  link: "patch",
                })
              }
            >
              {patch}
            </StyledBreadcrumbLink>
          </StyledP1>
        ) : (
          <H3 data-cy="bc-patch">{patch}</H3>
        )}
      </Breadcrumb.Item>
      {taskName && (
        <Breadcrumb.Item>
          <H3 data-cy="bc-task">{taskName}</H3>
        </Breadcrumb.Item>
      )}
    </StyledBreadcrumb>
  );
};

const StyledP1 = styled(P1)`
  display: inline-flex;
`;

const StyledBreadcrumb = styled(Breadcrumb)`
  margin-bottom: 16px;
`;

const StyledBreadcrumbLink = styled(StyledRouterLink)`
  color: ${blue.base} !important;
`;
