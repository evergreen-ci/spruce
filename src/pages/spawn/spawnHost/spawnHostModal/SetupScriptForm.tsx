import React, { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Checkbox from "@leafygreen-ui/checkbox";
import { Input, Tooltip } from "antd";
import { useLocation } from "react-router";
import { ConditionalWrapper } from "components/ConditionalWrapper";
import {
  GetSpawnTaskQuery,
  GetSpawnTaskQueryVariables,
} from "gql/generated/types";
import { GET_SPAWN_TASK } from "gql/queries";
import { parseQueryString, getString } from "utils";
import { Action as SpawnHostModalAction } from "./useSpawnHostModalState";

const { TextArea } = Input;

export type setupScriptType = {
  setUpScript?: string;
  useProjectSetupScript?: boolean;
  spawnHostsStartedByTask?: boolean;
  taskSync: boolean;
};

interface SetupScriptFormProps {
  onChange: React.Dispatch<SpawnHostModalAction>;
  data: setupScriptType;
}
export const SetupScriptForm: React.FC<SetupScriptFormProps> = ({
  onChange,
  data,
}) => {
  const {
    setUpScript,
    useProjectSetupScript,
    spawnHostsStartedByTask,
    taskSync,
  } = data;

  const { search } = useLocation();
  const queryParams = parseQueryString(search);
  const { taskId, distroId } = queryParams;
  const [hasSetupScript, setHasSetupScript] = useState(false);

  const [getTask, { data: taskData }] = useLazyQuery<
    GetSpawnTaskQuery,
    GetSpawnTaskQueryVariables
  >(GET_SPAWN_TASK);

  useEffect(() => {
    if (taskId && distroId) {
      console.log(taskId);
      getTask({ variables: { taskId: getString(taskId), execution: 0 } });
      onChange({
        type: "ingestQueryParams",
        taskId: getString(taskId),
        distroId: getString(distroId),
      });
    }
  }, [taskId, distroId, getTask, onChange]);

  console.log(taskData);
  const { displayName, buildVariant, revision, project, canSync } =
    taskData?.task || {};
  const hasTask = displayName && buildVariant && revision;
  const toggleSetupScript = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setHasSetupScript(checked);
    onChange({ type: "editSetupScript", setUpScript: checked ? "" : null });
  };
  return (
    <div>
      <Checkbox
        label="Define setup script to run after host is configured (i.e. task data and artifacts are loaded)"
        checked={hasSetupScript}
        onChange={toggleSetupScript}
      />
      {hasSetupScript && (
        <StyledTextArea
          data-cy="userDataScript-input"
          disabled={!hasSetupScript}
          value={setUpScript}
          placeholder="Setup script"
          autoSize={{ minRows: 4, maxRows: 6 }}
          onChange={(e) =>
            onChange({
              type: "editSetupScript",
              setUpScript: e.target.value,
            })
          }
        />
      )}
      {hasTask && (
        <>
          {project?.spawnHostScriptPath && (
            <Checkbox
              label={`Use project-specific setup script defined at ${project?.spawnHostScriptPath}`}
              checked={useProjectSetupScript}
              onChange={() =>
                onChange({
                  type: "setProjectSetupScript",
                  useProjectSetupScript: !useProjectSetupScript,
                })
              }
            />
          )}
          <Checkbox
            label={
              <>
                Load data for <b>{displayName}</b> on <b>{buildVariant}</b> @{" "}
                <b>{revision.substring(0, 5)}</b> onto host at startup.
              </>
            }
            checked
          />
          <ConditionalWrapper
            condition={!canSync}
            wrapper={(children) => (
              <Tooltip title="Task must be flagged as syncable to use this option.">
                <span>{children}</span>
              </Tooltip>
            )}
          >
            <Checkbox
              label="Load from task sync"
              data-cy="load-from-task-sync"
              checked={taskSync}
              onChange={() =>
                onChange({
                  type: "setTaskSync",
                  taskSync: !taskSync,
                })
              }
              disabled={!canSync}
            />
          </ConditionalWrapper>
          <Checkbox
            label="Also start any hosts this task started (if applicable)"
            checked={spawnHostsStartedByTask}
            onChange={() =>
              onChange({
                type: "setSpawnHostsStartedByTask",
                spawnHostsStartedByTask: !spawnHostsStartedByTask,
              })
            }
          />
        </>
      )}
    </div>
  );
};

const StyledTextArea = styled(TextArea)`
  margin: 15px 0;
`;
