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
        <P1 id="bc-my-patches">
          <StyledRouterLink to={paths.myPatches}>My Patches</StyledRouterLink>
        </P1>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <span id="bc-patch">
          {taskName ? (
            <P1>
              <StyledRouterLink to={`${paths.patch}/${versionId}`}>
                {patch}
              </StyledRouterLink>
            </P1>
          ) : (
            <H3>{patch}</H3>
          )}
        </span>
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
