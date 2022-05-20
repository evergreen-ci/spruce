import React, { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Checkbox from "@leafygreen-ui/checkbox";
import { Input } from "antd";
import { useLocation } from "react-router-dom";
import { size } from "constants/tokens";
import {
  GetSpawnTaskQuery,
  GetSpawnTaskQueryVariables,
} from "gql/generated/types";
import { GET_SPAWN_TASK } from "gql/queries";
import { queryString } from "utils";
import { shortenGithash } from "utils/string";
import { Action as SpawnHostModalAction } from "./useSpawnHostModalState";

const { getString, parseQueryString } = queryString;
const { TextArea } = Input;

export type setupScriptType = {
  setUpScript?: string;
  useProjectSetupScript?: boolean;
  spawnHostsStartedByTask?: boolean;
  taskSync: boolean;
  taskId?: string;
};

interface SetupScriptFormProps {
  onChange: React.Dispatch<SpawnHostModalAction>;
  data: setupScriptType;
}
export const SetupScriptForm: React.VFC<SetupScriptFormProps> = ({
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
  const { distroId } = queryParams;
  const taskIdQueryParam = getString(queryParams.taskId);
  const [hasSetupScript, setHasSetupScript] = useState(false);

  const [getTask, { data: taskData }] = useLazyQuery<
    GetSpawnTaskQuery,
    GetSpawnTaskQueryVariables
  >(GET_SPAWN_TASK);

  useEffect(() => {
    if (taskIdQueryParam && distroId) {
      getTask({ variables: { taskId: taskIdQueryParam, execution: 0 } });
      onChange({
        type: "ingestQueryParams",
        taskId: taskIdQueryParam,
        distroId: getString(distroId),
      });
    }
  }, [taskIdQueryParam, distroId, getTask, onChange]);

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
          <Checkbox
            label={
              <>
                Load data for <b>{displayName}</b> on <b>{buildVariant}</b> @{" "}
                <b>{shortenGithash(revision)}</b> onto host at startup
              </>
            }
            data-cy="parent-checkbox"
            checked={!!data.taskId}
            onChange={() => {
              onChange({
                type: "loadDataOntoHost",
                taskId: data.taskId ? "" : taskIdQueryParam,
              });
            }}
          />
          <Indent>
            {project?.spawnHostScriptPath && (
              <Checkbox
                data-cy="use-psss"
                label={`Use project-specific setup script defined at ${project?.spawnHostScriptPath}`}
                checked={useProjectSetupScript}
                onChange={() =>
                  onChange({
                    type: "setProjectSetupScript",
                    useProjectSetupScript: !useProjectSetupScript,
                    taskId: taskIdQueryParam,
                  })
                }
              />
            )}
            {canSync && (
              <Checkbox
                label="Load from task sync"
                data-cy="load-from-task-sync"
                checked={taskSync}
                onChange={() =>
                  onChange({
                    type: "setTaskSync",
                    taskSync: !taskSync,
                    taskId: taskIdQueryParam,
                  })
                }
                disabled={!canSync}
              />
            )}
            <Checkbox
              label="Also start any hosts this task started (if applicable)"
              data-cy="also-start-hosts"
              checked={spawnHostsStartedByTask}
              onChange={() =>
                onChange({
                  type: "setSpawnHostsStartedByTask",
                  spawnHostsStartedByTask: !spawnHostsStartedByTask,
                  taskId: taskIdQueryParam,
                })
              }
            />
          </Indent>
        </>
      )}
    </div>
  );
};
const Indent = styled.div`
  margin-left: ${size.s};
`;
const StyledTextArea = styled(TextArea)`
  margin: ${size.s} 0;
`;
