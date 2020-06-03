import React from "react";
import { Breadcrumb } from "antd";
import { routes, paths } from "constants/routes";
import styled from "@emotion/styled/macro";
import { H3, P1 } from "components/Typography";
import { StyledRouterLink } from "components/styles/StyledLink";

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
          <StyledRouterLink id="bc-my-patches" to={routes.myPatches}>
            My Patches
          </StyledRouterLink>
        </StyledP1>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        {taskName ? (
          <StyledP1>
            <StyledRouterLink id="bc-patch" to={`${paths.patch}/${versionId}`}>
              {patch}
            </StyledRouterLink>
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
