import React from "react";
import { Table } from "antd";
import { useParams } from "react-router-dom";
import { Patch } from "gql/generated/types";
import { DownstreamProjectAccordian } from "../patchRestartModal/DownstreamProjectAccordian";

type childPatches = Patch["childPatches"];
type childPatch = childPatches[0];

interface DownstreamTasksProps {
  childPatches: childPatches;
}

export const DownstreamTasks: React.FC<DownstreamTasksProps> = ({
  childPatches,
}) => {
  const { id } = useParams<{ id: string }>();
  const columns = [
    {
      title: "childPatch",
      render: (
        text: string,
        { project, patchID, status, taskCount }: childPatch
      ): JSX.Element => (
        <DownstreamProjectAccordian
          key={`downstream_project_${id}`}
          projectName={project}
          status={status}
          childPatchId={patchID}
          taskCount={taskCount}
        />
      ),
    },
  ];

  return (
    <div>
      <Table
        tableLayout="fixed"
        data-test-id="downstream-tasks-table"
        dataSource={childPatches}
        rowKey={({ patchID }) => patchID}
        columns={columns}
        pagination={false}
        showHeader={false}
      />
    </div>
  );
};
