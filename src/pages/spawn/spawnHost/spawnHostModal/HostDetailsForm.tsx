import React, { useReducer } from "react";
import styled from "@emotion/styled";
import Checkbox from "@leafygreen-ui/checkbox";
import { Subtitle, Body } from "@leafygreen-ui/typography";
import { Input } from "antd";
import {
  ExpirationField,
  ModalContent,
  SectionContainer,
} from "components/Spawn";
import { ExpirationDateType } from "components/Spawn/ExpirationField";
import { VolumesField, VolumesData } from "pages/spawn/spawnHost/fields";
import { MyVolume } from "types/spawn";
import { SetupScriptForm } from "./SetupScriptForm";
import { Action as SpawnHostModalAction } from "./useSpawnHostModalState";

const { TextArea } = Input;

export type hostDetailsStateType = {
  userDataScript?: string;
  noExpiration: boolean;
  expiration: any;
  volumeId?: string;
  homeVolumeSize?: number;
  isVirtualWorkStation: boolean;
  setUpScript?: string;
  useProjectSetupScript: boolean;
  taskSync: boolean;
  taskId?: string;
};

interface HostDetailsFormProps {
  onChange: React.Dispatch<SpawnHostModalAction>;
  data: hostDetailsStateType;
  volumes: MyVolume[];
  isSpawnHostModal: boolean;
}
export const HostDetailsForm: React.FC<HostDetailsFormProps> = ({
  onChange,
  data,
  volumes,
  isSpawnHostModal = false,
}) => {
  const { userDataScript, isVirtualWorkStation } = data;

  const [state, dispatch] = useReducer(reducer, initialState);
  const { hasUserDataScript } = state;

  const onToggleUserData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    dispatch({
      type: "toggleUserDataScript",
      hasUserDataScript: checked,
    });
    onChange({
      type: "editUserDataScript",
      userDataScript: checked ? userDataScript : undefined,
    });
  };
  return (
    <Container>
      {/* @ts-expect-error */}
      <StyledSubtitle> Optional Host Details</StyledSubtitle>
      <Checkbox
        label="Run Userdata script on start"
        checked={hasUserDataScript}
        onChange={onToggleUserData}
      />
      <StyledTextArea
        data-cy="userDataScript-input"
        disabled={!hasUserDataScript}
        value={userDataScript}
        placeholder="Userdata script"
        autoSize={{ minRows: 4, maxRows: 6 }}
        onChange={(e) =>
          onChange({
            type: "editUserDataScript",
            userDataScript: e.target.value,
          })
        }
      />
      <SetupScriptForm data={data} onChange={onChange} />

      <ExpirationField
        isVolume={false}
        data={data}
        onChange={(expData: ExpirationDateType) =>
          onChange({ type: "editExpiration", ...expData })
        }
      />

      {isVirtualWorkStation && (
        <SectionContainer>
          <SectionLabel weight="medium">Virtual Workstation</SectionLabel>
          <VolumesField
            data={data}
            onChange={(volData: VolumesData) =>
              onChange({ type: "editVolumes", ...volData })
            }
            volumes={volumes.filter((v) => v.homeVolume && !v.hostID)}
            allowHomeVolume={isSpawnHostModal}
          />
        </SectionContainer>
      )}
    </Container>
  );
};

const SectionLabel = styled(Body)`
  padding-right: 15px;
  margin-top: 22px;
  min-width: 175px;
`;

const Container = styled(ModalContent)`
  width: 90%;
`;

// @ts-expect-error
const StyledSubtitle = styled(Subtitle)`
  padding-bottom: 20px;
`;

const StyledTextArea = styled(TextArea)`
  margin: 15px 0;
`;

const initialState = { hasUserDataScript: false };
const reducer = (state: userDataScriptState, action: Action) => {
  switch (action.type) {
    case "toggleUserDataScript":
      return {
        hasUserDataScript: action.hasUserDataScript,
      };
    default:
      throw new Error();
  }
};

type userDataScriptState = {
  hasUserDataScript: boolean;
  userDataScript?: string;
};
type Action = { type: "toggleUserDataScript"; hasUserDataScript: boolean };
