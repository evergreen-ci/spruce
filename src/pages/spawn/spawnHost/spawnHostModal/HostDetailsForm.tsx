import React from "react";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import Checkbox from "@leafygreen-ui/checkbox";
import { Subtitle, Body } from "@leafygreen-ui/typography";
import { Input, Select } from "antd";
import { set } from "date-fns";
import DatePicker from "components/DatePicker";
import Icon from "components/icons/Icon";
import { InputLabel } from "components/styles";
import TimePicker from "components/TimePicker";
import { Volume } from "gql/generated/types";

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
    noExpiration,
    expiration,
    hasUserDataScript,
    userDataScript,
    isVirtualWorkstation,
    volume,
  } = data;

  const updateDate = (_, dateString) => {
    // This functions take in the date string returned from the datePicker component
    // It uses the date string since it comes in the format yyyy-mm-dd and it can be combined with the
    // value from the timePicker since it only returns a subset of the date and wont overwrite the entire date

    const year = dateString.slice(0, 4);
    const month = dateString.slice(5, 7);
    const date = dateString.slice(8, 10);
    const updatedTime = set(expiration, { year, month, date });
    onChange({ ...data, expiration: updatedTime });
  };

  const updateTime = (_, dateString) => {
    // This functions take in the time string returned from the timePicker component
    // It uses the date string since it comes in the format hh-mm-ss and it can be combined with the
    // value from the timePicker since it only returns a subset of the date and wont overwrite the entire date

    const hours = dateString.slice(0, 2);
    const minutes = dateString.slice(3, 5);
    const seconds = dateString.slice(7, 9);
    const updatedTime = set(expiration, { hours, minutes, seconds });
    onChange({ ...data, expiration: updatedTime });
  };

  const disabledDate = (current) => current < Date.now();

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
        <SectionLabel>Expiration</SectionLabel>
        <FlexColumnContainer>
          <InputLabel htmlFor="hostDetailsDatePicker">Date</InputLabel>
          <DatePicker
            id="hostDetailsDatePicker"
            onChange={updateDate}
            disabled={noExpiration}
            disabledDate={disabledDate}
            value={expiration}
          />
        </FlexColumnContainer>
        <PaddedBody>&amp;</PaddedBody>
        <FlexColumnContainer>
          <InputLabel htmlFor="hostDetailsTimePicker">Time</InputLabel>
          <TimePicker
            onChange={updateTime}
            disabled={noExpiration}
            disabledDate={disabledDate}
            value={expiration}
          />
        </FlexColumnContainer>
        <PaddedBody> or </PaddedBody>
        <PaddedCheckbox
          label="Never"
          checked={noExpiration}
          onChange={(e) =>
            onChange({ ...data, noExpiration: e.target.checked })
          }
        />{" "}
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
              placeholder="Select existing key"
              onChange={(v) => onChange({ ...data, volume: v })}
              value={volume}
            >
              {volumes?.map((v) => (
                <Option
                  value={v.id}
                  key={`volume_option1_${v.id}`}
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

const PaddedCheckbox = styled(Checkbox)`
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
