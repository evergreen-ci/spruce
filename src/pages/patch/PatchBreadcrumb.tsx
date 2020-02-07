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
        <Link to={routes.myPatches}>My Patches</Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>{displayName}</Breadcrumb.Item>
    </Breadcrumb>
  );
};
