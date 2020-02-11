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
      <StyledBreadcrumItem link={true}>
        <span id="bc-my-patches">
          <Link to={paths.myPatches}>My Patches</Link>
        </span>
      </StyledBreadcrumItem>
      <StyledBreadcrumItem link={isTask}>
        <span id="bc-patch">
          {isTask ? (
            <Link to={`${paths.patch}/${version}`}>Patch</Link>
          ) : (
            "Patch"
          )}
        </span>
      </StyledBreadcrumItem>
      {isTask && (
        <StyledBreadcrumItem>
          <span id="bc-task">{displayName}</span>
        </StyledBreadcrumItem>
      )}
    </StyledBreadcrumb>
  );
};

interface BreadcrumbItemProps {
  link?: boolean;
}

const StyledBreadcrumb = styled(Breadcrumb)`
  margin-bottom: 25px;
`;

const StyledBreadcrumItem = styled(Breadcrumb.Item)`
  span > a {
    color: ${(props: BreadcrumbItemProps) =>
      props.link ? "#40a9ff" : "rgba(0, 0, 0, 0.45)"};
  }
`;
