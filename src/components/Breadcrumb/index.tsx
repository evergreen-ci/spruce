import React from "react";
import { Breadcrumb } from "antd";
import { routes, paths } from "constants/routes";
import styled from "@emotion/styled/macro";
import { uiColors } from "@leafygreen-ui/palette";
import { H3, P1 } from "components/Typography";
import { StyledRouterLink } from "components/styles/StyledLink";

const { blue } = uiColors;

interface Props {
  versionId?: string; // only required when rendered on task page
  taskName?: string;
  patchNumber: number;
}

export const BreadCrumb: React.FC<Props> = ({
  versionId,
  taskName,
  patchNumber,
}) => {
  const patch = `Patch ${patchNumber}`;
  return (
    <StyledBreadcrumb>
      <Breadcrumb.Item>
        <StyledP1>
          <StyledBreadcrumbLink id="bc-my-patches" to={routes.myPatches}>
            My Patches
          </StyledBreadcrumbLink>
        </StyledP1>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        {taskName ? (
          <StyledP1>
            <StyledBreadcrumbLink
              id="bc-patch"
              to={`${paths.version}/${versionId}`}
            >
              {patch}
            </StyledBreadcrumbLink>
          </StyledP1>
        ) : (
          <H3 id="bc-patch">{patch}</H3>
        )}
      </Breadcrumb.Item>
      {taskName && (
        <Breadcrumb.Item>
          <H3 id="bc-task">{taskName}</H3>
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
