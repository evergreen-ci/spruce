import React, { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import styled from "@emotion/styled";
import Checkbox from "@leafygreen-ui/checkbox";
import { Input } from "antd";
import { useLocation } from "react-router";
import { GetTaskQuery, GetTaskQueryVariables } from "gql/generated/types";
import { GET_TASK } from "gql/queries";
import { parseQueryString, getString } from "utils";
import { Action as SpawnHostModalAction } from "./useSpawnHostModalState";

const { TextArea } = Input;

export type setupScriptType = {
  setUpScript?: string;
  useProjectSetupScript?: boolean;
  spawnHostsStartedByTask?: boolean;
};

interface SetupScriptFormProps {
  onChange: React.Dispatch<SpawnHostModalAction>;
  data: setupScriptType;
}
export const SetupScriptForm: React.FC<SetupScriptFormProps> = ({
  onChange,
  data,
}) => {
  const { setUpScript, useProjectSetupScript, spawnHostsStartedByTask } = data;

  const { search } = useLocation();
  const queryParams = parseQueryString(search);
  const { taskId, distroId } = queryParams;
  const [hasSetupScript, setHasSetupScript] = useState(false);

  const [getTask, { data: taskData }] = useLazyQuery<
    GetTaskQuery,
    GetTaskQueryVariables
  >(GET_TASK);

  useEffect(() => {
    if (taskId && distroId) {
      getTask({ variables: { taskId: getString(taskId), execution: 0 } });
      onChange({
        type: "setProjectSetupScript",
        taskId: getString(taskId),
        useProjectSetupScript: true,
        distroId: getString(distroId),
      });
    }
  }, [taskId, distroId, getTask, onChange]);

  const { displayName, buildVariant, revision } = taskData?.task || {};
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
                <b>{revision.substring(0, 5)}</b> onto host at startup
              </>
            }
            checked={useProjectSetupScript}
            onChange={(e) =>
              onChange({
                type: "setProjectSetupScript",
                taskId: getString(taskId),
                useProjectSetupScript: e.target.checked,
              })
            }
          />
          <Checkbox
            label={<>Also Start any hosts this task started (if applicable)</>}
            checked={spawnHostsStartedByTask}
            onChange={(e) =>
              onChange({
                type: "setSpawnHostsStartedByTask",
                spawnHostsStartedByTask: e.target.checked,
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
