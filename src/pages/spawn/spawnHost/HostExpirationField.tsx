import React from "react";
import styled from "@emotion/styled";
import Checkbox from "@leafygreen-ui/checkbox";
import { Body } from "@leafygreen-ui/typography";
import { set } from "date-fns";
import DatePicker from "components/DatePicker";
import { InputLabel } from "components/styles";
import TimePicker from "components/TimePicker";

export interface ExpirationDateType {
  expiration: Date;
  noExpiration: boolean;
}

interface HostExpirationFieldProps {
  data: ExpirationDateType;
  onChange: React.Dispatch<React.SetStateAction<any>>;
}
export const HostExpirationField: React.FC<HostExpirationFieldProps> = ({
  onChange,
  data,
}) => {
  const { expiration, noExpiration } = data;

  const updateDate = (_, dateString) => {
    // This functions take in the date string returned from the datePicker component
    // It uses the date string since it comes in the format yyyy-mm-dd and it can be combined with the
    // value from the timePicker since it only returns a subset of the date and wont overwrite the entire date

    const year = dateString.slice(0, 4);
    const month = dateString.slice(5, 7);
    const date = dateString.slice(8, 10);
    const updatedTime = set(expiration || new Date(), { year, month, date });
    onChange({ ...data, expiration: updatedTime });
  };

  const updateTime = (_, dateString) => {
    // This functions take in the time string returned from the timePicker component
    // It uses the date string since it comes in the format hh-mm-ss and it can be combined with the
    // value from the timePicker since it only returns a subset of the date and wont overwrite the entire date

    const hours = dateString.slice(0, 2);
    const minutes = dateString.slice(3, 5);
    const seconds = dateString.slice(7, 9);
    const updatedTime = set(expiration || new Date(), {
      hours,
      minutes,
      seconds,
    });
    onChange({ ...data, expiration: updatedTime });
  };

  const disabledDate = (current) => current < Date.now();
  return (
    <>
      <SectionLabel weight="medium">Expiration</SectionLabel>
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
        onChange={(e) => onChange({ ...data, noExpiration: e.target.checked })}
      />{" "}
    </>
  );
};

const FlexColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const SectionLabel = styled(Body)`
  padding-right: 15px;
  margin-top: 22px;
  min-width: 175px;
`;

const PaddedBody = styled.span`
  padding-left: 15px;
  padding-right: 15px;
  margin-top: 22px;
`;

const PaddedCheckbox = styled(Checkbox)`
  margin-top: 22px;
`;
