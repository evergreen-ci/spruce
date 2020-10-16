import React, { useState } from "react";
import styled from "@emotion/styled";
import Checkbox from "@leafygreen-ui/checkbox";
import { Input } from "antd";
import { Action as SpawnHostModalAction } from "./useSpawnHostModalState";

const { TextArea } = Input;

export type setupScriptType = {
  setUpScript?: string;
};

interface SetupScriptFormProps {
  onChange: React.Dispatch<SpawnHostModalAction>;
  data: setupScriptType;
}
export const SetupScriptForm: React.FC<SetupScriptFormProps> = ({
  onChange,
  data,
}) => {
  const { setUpScript } = data;
  const [hasSetupScript, setHasSetupScript] = useState(false);

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
    </div>
  );
};

const StyledTextArea = styled(TextArea)`
  margin: 15px 0;
`;
