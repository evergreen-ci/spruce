import React from "react";
import styled from "@emotion/styled";
import Checkbox from "@leafygreen-ui/checkbox";
import { set } from "date-fns";
import DatePicker from "components/DatePicker";
import { InputLabel } from "components/styles";
import TimePicker from "components/TimePicker";
import { SectionContainer, SectionLabel } from ".";

export interface ExpirationDateType {
  expiration?: Date;
  noExpiration?: boolean;
}

interface ExpirationFieldProps {
  data: ExpirationDateType;
  onChange: (data: ExpirationDateType) => void;
}

export const ExpirationField: React.FC<ExpirationFieldProps> = ({
  onChange,
  data,
}) => {
  const { expiration: expirationString, noExpiration } = data;
  const expiration = expirationString ? new Date(expirationString) : new Date();
  const updateDate = (d: Date) => {
    const year = d.getFullYear();
    const month = d.getMonth();
    const date = d.getDate();
    const updatedTime = set(expiration || new Date(), { year, month, date });
    onChange({ noExpiration, expiration: updatedTime });
  };

  const updateTime = (d: Date) => {
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const seconds = d.getSeconds();
    const updatedTime = set(expiration || new Date(), {
      hours,
      minutes,
      seconds,
    });
    onChange({ noExpiration, expiration: updatedTime });
  };

  const disabledDate = (current) => current < Date.now();
  return (
    <SectionContainer>
      <SectionLabel weight="medium">Expiration</SectionLabel>
      <FlexColumnContainer>
        <InputLabel htmlFor="hostDetailsDatePicker">Date</InputLabel>
        <DatePicker
          id="hostDetailsDatePicker"
          onChange={updateDate}
          disabled={noExpiration}
          disabledDate={disabledDate}
          value={expiration}
          allowClear={false}
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
          allowClear={false}
        />
      </FlexColumnContainer>
      <PaddedBody> or </PaddedBody>
      <PaddedCheckbox
        label="Never"
        checked={noExpiration}
        onChange={(e) =>
          onChange({ noExpiration: e.target.checked, expiration })
        }
      />{" "}
    </SectionContainer>
  );
};

const FlexColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const PaddedBody = styled.span`
  padding-left: 15px;
  padding-right: 15px;
  margin-top: 22px;
`;

const PaddedCheckbox = styled(Checkbox)`
  margin-top: 22px;
`;
