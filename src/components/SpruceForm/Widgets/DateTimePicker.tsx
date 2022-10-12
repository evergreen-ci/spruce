import styled from "@emotion/styled";
import { Description, Label } from "@leafygreen-ui/typography";
import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";
import DatePicker from "components/DatePicker";
import TimePicker from "components/TimePicker";
import { size } from "constants/tokens";
import { SpruceWidgetProps } from "./types";

export const DateTimePicker: React.VFC<
  {
    options: {
      disablePastDatetime?: boolean;
      timezone?: string;
    };
  } & SpruceWidgetProps
> = ({ disabled, id, label, onChange, options, readonly, value }) => {
  const { description, disablePastDatetime, showLabel, timezone } = options;

  const currentDateTime = timezone
    ? utcToZonedTime(new Date(value), timezone)
    : new Date(value);
  const isDisabled = disabled || readonly;
  const handleChange = (d: Date) => {
    console.log("on h");
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
    <>
      {showLabel !== false && (
        <Label disabled={isDisabled} htmlFor={id}>
          {label}
        </Label>
      )}
      {description && <Description>{description}</Description>}
      <DateTimeContainer>
        <DatePicker
          // @ts-expect-error
          getPopupContainer={getPopupContainer}
          data-cy="date-picker"
          onChange={handleChange}
          value={currentDateTime}
          allowClear={false}
          disabled={isDisabled}
          disabledDate={disabledDate}
        />
        <TimePicker
          // @ts-ignore
          getPopupContainer={getPopupContainer}
          data-cy="time-picker"
          onChange={handleChange}
          value={currentDateTime}
          allowClear={false}
          disabled={isDisabled}
          disabledDate={disabledDate}
        />
      </DateTimeContainer>
    </>
  );
};

const DateTimeContainer = styled.div`
  > :not(:last-of-type) {
    margin-right: ${size.xs};
  }
`;

// Fixes bug where DatePicker won't handle onClick events
const getPopupContainer = (triggerNode: HTMLElement) => triggerNode.parentNode;
