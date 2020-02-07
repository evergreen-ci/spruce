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
        <span id="tb-my-patches">
          <Link to={paths.myPatches}>My Patches</Link>
        </span>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <span id="tb-patch">
          <Link to={`${paths.patch}/${version}`}>Patch</Link>
        </span>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <span id="tb-display-name">{displayName}</span>
      </Breadcrumb.Item>
    </Breadcrumb>
  );
};
