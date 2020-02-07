import React from "react";
import { Breadcrumb } from "antd";
import { useQuery } from "@apollo/react-hooks";
import { useLocation, useParams } from "react-router-dom";
import { paths, routes } from "contants/routes";
import gql from "graphql-tag";
import { Link } from "react-router-dom";

const GET_PATCH_ID_OF_TASK = gql`
  query task($taskId: String!) {
    task(taskId: $taskId) {
      version
    }
  }
`;

const PatchBreadcrumb = () => {
  return (
    <Breadcrumb>
      <Breadcrumb.Item>
        <Link to={routes.myPatches}>My Patches</Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>Specific Patch</Breadcrumb.Item>
    </Breadcrumb>
  );
};

const TaskBreadcrumb = () => {
  const { taskID } = useParams<{ taskID: string }>();
  //   const { data, loading, error } = useQuery<{ version: string }>(
  //     GET_PATCH_ID_OF_TASK,
  //     {
  //       variables: { taskId: taskID }
  //     }
  //   );

  //   if (error) {
  //     return null;
  //   }

  return (
    <Breadcrumb>
      <Breadcrumb.Item>
        <Link to={routes.myPatches}>My Patches</Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <a href="/">link</a>
        {/* <Link to={`patch/5dc5b45897b1d35e9c0d45bb`}>Patch</Link> */}
        {/* {loading ? (
          "Patch"
        ) : (
          <Link to={`${paths.patch}/5dc5b45897b1d35e9c0d45bb`}>Patch</Link>
        )} */}
      </Breadcrumb.Item>
      <Breadcrumb.Item>Task</Breadcrumb.Item>
    </Breadcrumb>
  );
};

export const BreadCrumb = () => {
  const { pathname } = useLocation();

  return (
    <Breadcrumb>
      <Breadcrumb.Item>Home</Breadcrumb.Item>
      <Breadcrumb.Item>
        <a href="/">Application Center</a>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <a href="/hello">Application List</a>
      </Breadcrumb.Item>
      <Breadcrumb.Item>An Application</Breadcrumb.Item>
    </Breadcrumb>
  );

  //   if (pathname.includes(paths.patch)) {
  //     return <PatchBreadcrumb />;
  //   }
  //   if (pathname.includes(paths.task)) {
  //     return <TaskBreadcrumb />;
  //   }
  //   return null;
};
