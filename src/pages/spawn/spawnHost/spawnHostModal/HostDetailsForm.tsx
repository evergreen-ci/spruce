import React from "react";
import styled from "@emotion/styled";
import Checkbox from "@leafygreen-ui/checkbox";
import { Subtitle, Body } from "@leafygreen-ui/typography";
import { Input } from "antd";
import { ExpirationField as HostExpirationField } from "components/Spawn";
import { VolumesField } from "pages/spawn/spawnHost/fields";
import { MyVolume } from "types/spawn";
import {
  editExpirationData,
  editVolumesData,
} from "../editSpawnHostModal/useEditSpawnHostModalState";

const { TextArea } = Input;

export type hostDetailsStateType = {
  hasUserDataScript: boolean;
  userDataScript: string;
  noExpiration: boolean;
  expiration: Date;
  volumeId: string;
  homeVolumeSize: number;
  isVirtualWorkStation: boolean;
};

interface HostDetailsFormProps {
  onChange: React.Dispatch<React.SetStateAction<hostDetailsStateType>>;
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
  const { hasUserDataScript, userDataScript, isVirtualWorkStation } = data;

  return (
    <Container>
      <StyledSubtitle> Optional Host Details</StyledSubtitle>
      <Checkbox
        label="Run Userdata script on start"
        checked={hasUserDataScript}
        onChange={(e) =>
          onChange({ ...data, hasUserDataScript: e.target.checked })
        }
      />
      <StyledTextArea
        data-cy="userDataScript-input"
        disabled={!hasUserDataScript}
        value={userDataScript}
        placeholder="Userdata script"
        autoSize={{ minRows: 4, maxRows: 6 }}
        onChange={(e) => onChange({ ...data, userDataScript: e.target.value })}
      />
      <SectionContainer>
        <SectionLabel weight="medium">Expiration</SectionLabel>

        <HostExpirationField
          data={data}
          onChange={(expData: editExpirationData) =>
            onChange({ ...data, ...expData })
          }
        />
      </SectionContainer>

      {isVirtualWorkStation && (
        <SectionContainer>
          <SectionLabel weight="medium">Virtual Workstation</SectionLabel>
          <VolumesField
            data={data}
            onChange={(volData: editVolumesData) =>
              onChange({ ...data, ...volData })
            }
            volumes={volumes}
            allowHomeVolume={isSpawnHostModal}
          />
        </SectionContainer>
      )}
    </Container>
  );
};

const FlexColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const FlexContainer = styled.div`
  display: flex;
`;

const SectionContainer = styled(FlexContainer)`
  align-items: center;
  margin-top: 15px;
`;

const SectionLabel = styled(Body)`
  padding-right: 15px;
  margin-top: 22px;
  min-width: 175px;
`;

const Container = styled(FlexColumnContainer)`
  width: 90%;
`;

const StyledSubtitle = styled(Subtitle)`
  padding-bottom: 20px;
`;

const StyledTextArea = styled(TextArea)`
  margin: 15px 0;
`;
