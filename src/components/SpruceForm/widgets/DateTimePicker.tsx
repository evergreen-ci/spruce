import styled from "@emotion/styled";
import { Description, Label } from "@leafygreen-ui/typography";
import { Widget } from "@rjsf/core";
import DatePicker from "components/DatePicker";
import TimePicker from "components/TimePicker";
import { size } from "constants/tokens";

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

  const currentDateTime = new Date(value);
  const isDisabled = disabled || readonly;

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
          onChange={(d: Date) => onChange(d.toString())}
          value={currentDateTime}
          allowClear={false}
          disabled={isDisabled}
        />
        <TimePicker
          data-cy="time-picker"
          onChange={(t: Date) => onChange(t.toString())}
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
