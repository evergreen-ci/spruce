import React from "react";
import { Link } from "react-router-dom";
import { Breadcrumb } from "antd";
import { paths } from "contants/routes";
import styled from "@emotion/styled/macro";

interface Props {
  version?: string; // only required when rendered on task page
  isTask?: boolean;
  displayName: string;
}

export const BreadCrumb: React.FC<Props> = ({
  version,
  displayName,
  isTask = false
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
            <Link to={`${paths.patch}/${version}`}>Patch</Link>
          ) : (
            "Patch"
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
  margin-bottom: 25px;
`;

const Text = styled.span`
  & > a {
    color: #40a9ff;
  }
`;
