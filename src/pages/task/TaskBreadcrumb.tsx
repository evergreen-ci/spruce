import React from "react";
import { Link } from "react-router-dom";
import { Breadcrumb } from "antd";
import { paths } from "contants/routes";

interface Props {
  version: string;
  displayName: string;
}

export const TaskBreadcrumb: React.FC<Props> = ({ version, displayName }) => {
  return (
    <Breadcrumb>
      <Breadcrumb.Item>
        <Link to={paths.myPatches}>My Patches</Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <Link to={`${paths.patch}/${version}`}>Patch</Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>{displayName}</Breadcrumb.Item>
    </Breadcrumb>
  );
};
