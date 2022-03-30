import styled from "@emotion/styled";
import { Description, Label } from "@leafygreen-ui/typography";
import { Widget } from "@rjsf/core";
import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";
import DatePicker from "components/DatePicker";
import TimePicker from "components/TimePicker";
import { size } from "constants/tokens";
import { useUserTimeZone } from "hooks/useUserTimeZone";

export const DateTimePicker: Widget = ({
  disabled,
  id,
  label,
  onChange,
  options,
  readonly,
  value,
}) => {
  const { description, showLabel } = options;

  const timezone = useUserTimeZone();
  const currentDateTime = utcToZonedTime(new Date(value), timezone);
  const isDisabled = disabled || readonly;
  const handleChange = (d: Date) =>
    onChange(zonedTimeToUtc(d, timezone).toString());

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
          data-cy="date-picker"
          onChange={handleChange}
          value={currentDateTime}
          allowClear={false}
          disabled={isDisabled}
        />
        <TimePicker
          data-cy="time-picker"
          onChange={handleChange}
          value={currentDateTime}
          allowClear={false}
          disabled={isDisabled}
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
