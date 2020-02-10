import React from "react";
import { Link } from "react-router-dom";
import { Breadcrumb } from "antd";
import { paths } from "contants/routes";

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
    <Breadcrumb>
      <Breadcrumb.Item>
        <span id="bc-my-patches">
          <Link to={paths.myPatches}>My Patches</Link>
        </span>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <span id="bc-patch">
          {isTask ? (
            <Link to={`${paths.patch}/${version}`}>Patch</Link>
          ) : (
            "Patch"
          )}
        </span>
      </Breadcrumb.Item>
      {isTask && (
        <Breadcrumb.Item>
          <span id="bc-task">{displayName}</span>
        </Breadcrumb.Item>
      )}
    </Breadcrumb>
  );
};
