import React from "react";
import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";
import { routes } from "contants/routes";

interface Props {
  displayName: string;
}

export const PatchBreadcrumb: React.FC<Props> = ({ displayName }) => {
  return (
    <Breadcrumb>
      <Breadcrumb.Item>
        <span id="pb-my-patches">
          <Link to={routes.myPatches}>My Patches</Link>
        </span>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <span id="pb-patch">{displayName}</span>
      </Breadcrumb.Item>
    </Breadcrumb>
  );
};
