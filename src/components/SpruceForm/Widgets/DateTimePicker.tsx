import styled from "@emotion/styled";
import { Description, Label } from "@leafygreen-ui/typography";
import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";
import DatePicker from "components/DatePicker";
import TimePicker from "components/TimePicker";
import { size } from "constants/tokens";
import ElementWrapper from "../ElementWrapper";
import { SpruceWidgetProps } from "./types";

export const DateTimePicker: React.VFC<
  {
    options: {
      disablePastDatetime?: boolean;
      timezone?: string;
    };
  } & SpruceWidgetProps
> = ({ disabled, id, label, onChange, options, readonly, value = "" }) => {
  const {
    description,
    disablePastDatetime,
    showLabel,
    timezone,
    elementWrapperCSS,
  } = options;

  const currentDateTime = timezone
    ? utcToZonedTime(new Date(value || null), timezone)
    : new Date(value || null);
  const isDisabled = disabled || readonly;
  const handleChange = (d: Date) => {
    onChange(
      timezone ? zonedTimeToUtc(d, timezone).toString() : new Date(d).toString()
    );
  };
  const disabledDate = disablePastDatetime
    ? (current) =>
        timezone
          ? utcToZonedTime(current, timezone) < currentDateTime
          : current < Date.now()
    : undefined;

  return (
    <ElementWrapper css={elementWrapperCSS}>
      {showLabel !== false && (
        <Label disabled={isDisabled} htmlFor={id}>
          {label}
        </Label>
      )}
      {description && <Description>{description}</Description>}
      <DateTimeContainer>
        <DatePicker
          data-cy="date-picker"
          onChange={handleChange}
          value={currentDateTime}
          allowClear={false}
          disabled={isDisabled}
          disabledDate={disabledDate}
        />
        <TimePicker
          data-cy="time-picker"
          onChange={handleChange}
          value={currentDateTime}
          allowClear={false}
          disabled={isDisabled}
          disabledDate={disabledDate}
        />
      </DateTimeContainer>
    </ElementWrapper>
  );
};

const DateTimeContainer = styled.div`
  display: flex;
  gap: ${size.xs};
`;
