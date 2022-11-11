import { forwardRef } from "react";
import { PickerTimeProps } from "antd/es/date-picker/generatePicker";
import DatePicker, { DatePickerProps } from "components/DatePicker";

export interface TimePickerProps
  extends Omit<PickerTimeProps<Date>, "picker">,
    DatePickerProps {}

const TimePicker = forwardRef<any, TimePickerProps>((props, ref) => (
  <DatePicker {...props} picker="time" mode={undefined} ref={ref} />
));

TimePicker.displayName = "TimePicker";

export default TimePicker;
