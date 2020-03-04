import React from "react";
import { Link } from "react-router-dom";
import { Breadcrumb } from "antd";
import { paths } from "contants/routes";
import styled from "@emotion/styled/macro";

interface Props {
  versionId?: string; // only required when rendered on task page
  isTask?: boolean;
  displayName: string;
  patchName?: string;
}

export const BreadCrumb: React.FC<Props> = ({
  versionId,
  displayName,
  isTask = false,
  patchName
}) => {
  return (
    <StyledBreadcrumb>
      <Breadcrumb.Item>
        <Text id="bc-my-patches">
          <Link to={paths.myPatches}>My Patches</Link>
        </Text>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <Text id="bc-patch">
          {isTask ? (
            <Link to={`${paths.patch}/${versionId}`}>Patch</Link>
          ) : (
            `Patch: ${patchName}`
          )}
        </Text>
      </Breadcrumb.Item>
      {isTask && (
        <Breadcrumb.Item>
          <Text id="bc-task">{displayName}</Text>
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
