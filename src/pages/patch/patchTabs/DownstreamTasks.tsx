import React from "react";
import { Table } from "antd";
import { Patch } from "gql/generated/types";
import { DownstreamProjectAccordion } from "./DownstreamProjectAccordion";

type childPatchesType = Patch["childPatches"];
type childPatch = childPatchesType[0];

interface DownstreamTasksProps {
  childPatches: childPatchesType;
}

export const DownstreamTasks: React.FC<DownstreamTasksProps> = ({
  childPatches,
}) => {
  const columns = [
    {
      title: <span data-cy="child-patch">Child Patch</span>,
      render: (
        text: string,
        { project, patchID, status, taskCount }: childPatch
      ): JSX.Element => (
        <DownstreamProjectAccordion
          key={`downstream_project_${patchID}`}
          projectName={project}
          status={status}
          childPatchId={patchID}
          taskCount={taskCount}
        />
      ),
    },
  ];

  return (
    <Table
      tableLayout="fixed"
      data-cy="downstream-tasks-table"
      dataSource={childPatches}
      rowKey={({ patchID }) => patchID}
      columns={columns}
      pagination={false}
      showHeader={false}
    />
  );
};
