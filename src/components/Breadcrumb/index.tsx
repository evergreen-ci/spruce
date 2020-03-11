import React from "react";
import { Link } from "react-router-dom";
import { Breadcrumb } from "antd";
import { paths } from "contants/routes";
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
  patchNumber
}) => {
  const patch = `Patch ${patchNumber}`;
  return (
    <StyledBreadcrumb>
      <Breadcrumb.Item>
        <P1>
          <StyledRouterLink id="bc-my-patches" to={paths.myPatches}>
            My Patches
          </StyledRouterLink>
        </P1>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        {taskName ? (
          <P1>
            <StyledRouterLink id="bc-patch" to={`${paths.patch}/${versionId}`}>
              {patch}
            </StyledRouterLink>
          </P1>
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

const StyledBreadcrumb = styled(Breadcrumb)`
  margin-bottom: 24px;
`;
