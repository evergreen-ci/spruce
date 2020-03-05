import React from "react";
import { Link } from "react-router-dom";
import { Breadcrumb } from "antd";
import { paths } from "contants/routes";
import styled from "@emotion/styled/macro";

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
        <Text id="bc-my-patches">
          <Link to={paths.myPatches}>My Patches</Link>
        </Text>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <Text id="bc-patch">
          {taskName ? (
            <Link to={`${paths.patch}/${versionId}`}>{patch}</Link>
          ) : (
            patch
          )}
        </Text>
      </Breadcrumb.Item>
      {taskName && (
        <Breadcrumb.Item>
          <Text id="bc-task">{taskName}</Text>
        </Breadcrumb.Item>
      )}
    </StyledBreadcrumb>
  );
};

const StyledBreadcrumb = styled(Breadcrumb)`
  margin-bottom: 24px;
`;

const Text = styled.span`
  & > a {
    color: #40a9ff;
  }
`;
