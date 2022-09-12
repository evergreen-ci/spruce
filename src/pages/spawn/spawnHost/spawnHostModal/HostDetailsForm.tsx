import { useReducer } from "react";
import styled from "@emotion/styled";
import Checkbox from "@leafygreen-ui/checkbox";
import TextArea from "@leafygreen-ui/text-area";
import { Subtitle, Body } from "@leafygreen-ui/typography";
import {
  ExpirationField,
  ModalContent,
  SectionContainer,
} from "components/Spawn";
import { ExpirationDateType } from "components/Spawn/ExpirationField";
import { size } from "constants/tokens";
import { VolumesField, VolumesData } from "pages/spawn/spawnHost/fields";
import { MyVolume } from "types/spawn";
import { SetupScriptForm } from "./SetupScriptForm";
import { Action as SpawnHostModalAction } from "./useSpawnHostModalState";

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
export const HostDetailsForm: React.VFC<HostDetailsFormProps> = ({
  onChange,
  data,
  volumes,
  isSpawnHostModal = false,
}) => {
  const { userDataScript, isVirtualWorkStation } = data;

  return (
    <Container>
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
  padding-right: ${size.s};
  margin-top: ${size.m};
  min-width: 175px;
`;

const Container = styled(ModalContent)`
  width: 90%;
`;

// @ts-expect-error
const StyledSubtitle = styled(Subtitle)`
  padding-bottom: ${size.s};
`;

const StyledTextArea = styled(TextArea)`
  margin: ${size.s} 0;
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
