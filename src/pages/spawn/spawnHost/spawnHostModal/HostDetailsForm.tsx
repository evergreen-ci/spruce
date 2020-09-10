import React from "react";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import Checkbox from "@leafygreen-ui/checkbox";
import { Subtitle, Body } from "@leafygreen-ui/typography";
import { Input, Select } from "antd";
import Icon from "components/icons/Icon";
import { InputLabel } from "components/styles";
import { Volume } from "gql/generated/types";
import { HostExpirationField } from "pages/spawn/spawnHost/HostExpirationField";

const { Option } = Select;
const { TextArea } = Input;

export type hostDetailsStateType = {
  hasUserDataScript: boolean;
  userDataScript: string;
  noExpiration: boolean;
  expiration: Date;
  volume: string;
  isVirtualWorkstation: boolean;
};

interface HostDetailsFormProps {
  onChange: React.Dispatch<React.SetStateAction<hostDetailsStateType>>;
  data: hostDetailsStateType;
  volumes: Volume[];
}
export const HostDetailsForm: React.FC<HostDetailsFormProps> = ({
  onChange,
  data,
  volumes,
}) => {
  const {
    hasUserDataScript,
    userDataScript,
    isVirtualWorkstation,
    volume,
  } = data;

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
        <HostExpirationField data={data} onChange={onChange} />
      </SectionContainer>

      {isVirtualWorkstation && (
        <SectionContainer>
          <SectionLabel>Virtual Workstation</SectionLabel>
          <FlexColumnContainer>
            <InputLabel htmlFor="hostDetailsDatePicker">Volume</InputLabel>
            <Select
              id="volumesSelectDropown"
              showSearch
              style={{ width: 200 }}
              placeholder="Select volume"
              onChange={(v) => onChange({ ...data, volume: v })}
              value={volume}
            >
              {volumes?.map((v) => (
                <Option
                  value={v.id}
                  key={`volume_option_${v.id}`}
                  disabled={v.hostID == null}
                >
                  ({v.size}gb) {v.displayName || v.id}
                </Option>
              ))}
            </Select>
          </FlexColumnContainer>
          <PaddedBody> or </PaddedBody>
          <PaddedButton glyph={<Icon glyph="Plus" />}>
            Create a Volume
          </PaddedButton>
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

const PaddedBody = styled.span`
  padding-left: 15px;
  padding-right: 15px;
  margin-top: 22px;
`;

const PaddedButton = styled(Button)`
  margin-top: 22px;
`;

const StyledSubtitle = styled(Subtitle)`
  padding-bottom: 20px;
`;

const StyledTextArea = styled(TextArea)`
  margin: 15px 0;
`;
